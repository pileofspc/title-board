import { v4 as uuidv4 } from "uuid";

const defaultTitle = {
    name: "Новый тайтл",
    description: "Описание нового тайтла",
    status: "NOT_WATCHED",
    pos_x: 50,
    pos_y: 50,
    tags: [],
};

const MAX_TAGS = 5;

const construct = {
    getTitles: function (perpage: number, offset: number): CustomQuery {
        return {
            text: `SELECT titles.*, json_agg(tags.*) AS tags FROM titles
            LEFT JOIN tags ON titles.uuid = tags.title_uuid
            GROUP BY titles.uuid
            ORDER BY titles.id DESC LIMIT $1 OFFSET $2`,
            values: [perpage, offset],
        };
    },
    getAllTitles: function (): CustomQuery {
        return {
            //text: `SELECT titles.*, CASE WHEN COUNT(tags) = 0 THEN '[]' ELSE json_agg(tags.*) END AS tags FROM titles
            text: `SELECT titles.*, COALESCE(json_agg(tags.*) FILTER(WHERE tags.title_uuid IS NOT NULL), '[]') AS tags FROM titles
            LEFT JOIN tags ON titles.uuid = tags.title_uuid
            GROUP BY titles.uuid
            ORDER BY titles.id DESC`,
        };
    },
    getAllTitlesWithoutTags: function (): CustomQuery {
        return {
            text: `SELECT * FROM titles
            LEFT JOIN tags ON titles.uuid = tags.title_uuid
            ORDER BY titles.id DESC`,
        };
    },
    getTitlesCount: function (): CustomQuery {
        return { text: "SELECT COUNT(*) FROM titles" };
    },
    postTitle: function (
        title: TitleServerPartial,
        titleUUID: string
    ): CustomQuery {
        return {
            text: `INSERT INTO titles(uuid, name, description, rating, img, link, pos_x, pos_y, status)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            values: [
                titleUUID,
                title.name || defaultTitle.name,
                title.description || defaultTitle.description,
                title.rating,
                title.img,
                title.link,
                title.pos_x || defaultTitle.pos_x,
                title.pos_y || defaultTitle.pos_y,
                title.status || defaultTitle.status,
            ],
        };
    },
    updateTitle: function (title: TitleServer): CustomQuery {
        return {
            text: `UPDATE titles
            SET name = $2,
                description = $3,
                rating = $4,
                img = $5,
                link = $6,
                pos_x = $7,
                pos_y = $8,
                status = $9
            WHERE uuid = $1
            RETURNING *
            `,
            values: [
                title.uuid,
                title.name || defaultTitle.name,
                title.description || defaultTitle.description,
                title.rating,
                title.img,
                title.link,
                title.pos_x || defaultTitle.pos_x,
                title.pos_y || defaultTitle.pos_y,
                title.status || defaultTitle.status,
            ],
        };
    },
    deleteTitle: function (titleUUID: string): CustomQuery {
        return {
            text: "DELETE FROM titles WHERE uuid = $1",
            values: [titleUUID],
        };
    },

    getTags: function (titleUUID: string): CustomQuery {
        return {
            text: `SELECT * FROM tags
            WHERE title_uuid = $1
            ORDER BY created_at, id DESC`,
            values: [titleUUID],
        };
    },
    getTagsCount: function (titleUUID: string): CustomQuery {
        return {
            text: `SELECT COUNT(*) FROM tags
            WHERE title_uuid = $1`,
            values: [titleUUID],
        };
    },
    postTags: function (tags: TagPartial[], titleUUID: string): CustomQuery {
        if (tags.length === 0) {
            return { skip: true };
        }
        if (tags.length > MAX_TAGS) {
            throw new Error("Невозможно добавить больше 5 тегов одновременно");
        }

        let counter = 1;
        let text = "INSERT INTO tags(text, color, title_uuid) VALUES";
        tags.forEach((tag, index) => {
            if (index > 0) {
                text += ", ";
            }
            text += `($${counter++}, $${counter++}, $${counter++})`;
        });
        text += " RETURNING *";

        const values = tags.reduce((acc: string[], value) => {
            acc.push(value.text, value.color, titleUUID);
            return acc;
        }, []);

        return { text, values };
    },
    deleteTags: function (titleUUID: string): CustomQuery {
        return {
            text: "DELETE FROM tags WHERE title_uuid = $1",
            values: [titleUUID],
        };
    },
    // updateTags не нужен, потому что это по сути будет две команды DELETE, а затем INSERT, которые уже есть в объекте
};

export async function postTitle(
    title: TitleServerPartial
): Promise<TitleServer> {
    const uuid = uuidv4();

    if (title.tags.length === 0) {
        return (await query(construct.postTitle(title, uuid)))[0];
    }

    const results = await queryTransaction([
        construct.postTitle(title, uuid),
        construct.postTags(title.tags, uuid),
    ]);
    const titleResult: TitleServer = results[0]?.[0];
    const tagsResult: Tag[] = results[1] || [];
    titleResult.tags = tagsResult;
    return titleResult;
}
export async function updateTitle(title: TitleServer): Promise<TitleServer> {
    const results = await queryTransaction([
        construct.updateTitle(title),
        construct.deleteTags(title.uuid),
        construct.postTags(title.tags, title.uuid),
    ]);

    const titleResult: TitleServer = results[0]?.[0];
    const tagsResult: Tag[] = results[2] || [];
    titleResult.tags = tagsResult;
    return titleResult;
}
export async function deleteTitle(titleUUID: string): Promise<void> {
    return void (await query(construct.deleteTitle(titleUUID)));
}
export async function getTitles(
    perpage: number,
    offset: number
): Promise<TitleServer[]> {
    const result: TitleServer[] = await query(
        construct.getTitles(perpage, offset)
    );

    for (const title of result) {
        title.tags
            ? (title.tags = title.tags.filter((tag) => tag))
            : (title.tags = []);
    }
    return result;
}
export async function getAllTitles(): Promise<TitleServer[]> {
    return await query(construct.getAllTitles());
}
export async function getTitlesCount(): Promise<number> {
    return (await query(construct.getTitlesCount()))[0].count;
}

// TODO: Сделать так, чтобы хотя бы теги (а может быть и тайтлы тоже) не перезаписывались полностью
// На данный момент получается слишком много перезаписей, в том числе uuid, из-за чего на фронте неправильные анимации, так как там uuid используется в качестве ключа