import { Query } from "pg";
import { query } from "~/server/utils/db.server";

const defaultTitle = {
    name: "Новый тайтл",
    description: "Описание нового тайтла",
    status: "NOT_WATCHED",
    pos_x: 50,
    pos_y: 50,
    tags: [],
};

const MAX_TAGS = 5;

export async function updateTitle(title: TitleServer): Promise<TitleServer[]> {
    return (
        await query(
            `UPDATE titles
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
            [
                title.uuid,
                title.name || defaultTitle.name,
                title.description || defaultTitle.description,
                title.rating,
                title.img,
                title.link,
                title.pos_x || defaultTitle.pos_x,
                title.pos_y || defaultTitle.pos_y,
                title.status || defaultTitle.status,
            ]
        )
    ).rows[0];
}

export async function addTitle(
    title: TitleServerPartial
): Promise<TitleServer> {
    return (
        await query(
            "INSERT INTO titles(name, description, rating, img, link, pos_x, pos_y, status) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [
                title.name || defaultTitle.name,
                title.description || defaultTitle.description,
                title.rating,
                title.img,
                title.link,
                title.pos_x || defaultTitle.pos_x,
                title.pos_y || defaultTitle.pos_y,
                title.status || defaultTitle.status,
            ]
        )
    ).rows[0];
}

export async function deleteTitle(titleUUID: string): Promise<TitleServer[]> {
    // await query("DELETE FROM tags WHERE title_uuid = $1", [titleUUID]);
    return (
        await query(
            `DELETE FROM titles WHERE uuid = $1;
            DELETE FROM tags WHERE title_uuid = $1`,
            [titleUUID]
        )
    ).rows;
}

export async function getTitlesTotal(): Promise<number> {
    // Код для определения ПРИМЕРНОГО количества записей
    // return (
    //     await query(
    //         "SELECT reltuples FROM pg_class WHERE oid = 'public.titles'::regclass;"
    //     )
    // )?.rows[0]?.reltuples;
    return (await query("SELECT COUNT(*) FROM titles"))?.rows[0].count;
}

export async function getAllTitles(): Promise<TitleServer[]> {
    return (await query("SELECT * FROM titles ORDER BY id DESC")).rows;
}
export async function getTitles(
    perpage: number,
    offset: number
): Promise<TitleServer[]> {
    // "SELECT * FROM titles LEFT JOIN tags ON titles.uuid = tags.title_uuid ORDER BY titles.id DESC LIMIT $1 OFFSET $2",
    const result: TitleServer[] = (
        await query(
            `SELECT titles.*, json_agg(tags.*) AS tags FROM titles
            LEFT JOIN tags ON titles.uuid = tags.title_uuid
            GROUP BY titles.uuid
            ORDER BY titles.id DESC LIMIT $1 OFFSET $2
        `,
            [perpage, offset]
        )
    ).rows;

    for (const title of result) {
        title.tags
            ? (title.tags = title.tags.filter((tag) => tag))
            : (title.tags = []);
    }
    return result;
}

export async function getTagsOfTitle(titleUUID: string): Promise<Tag[]> {
    return (
        await query(
            `SELECT * FROM tags
        WHERE title_uuid = $1
        ORDER BY created_at, id DESC`,
            [titleUUID]
        )
    ).rows;
}

function constructAddTagQuery(
    tags: TagPartial[],
    titleUUID: string
): CustomQuery {
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

    return [text, values];
}

export async function addTags(
    tags: TagPartial[],
    titleUUID: string
): Promise<Tag[]> {
    if (tags.length === 0) {
        return await getTagsOfTitle(titleUUID);
    }
    const tagsAmount = (await getTagsOfTitle(titleUUID)).length;
    if (tagsAmount > MAX_TAGS) {
        throw new Error("Невозможно присвоить тайтлу больше 5 тегов!");
    }

    const constructedQuery = constructAddTagQuery(tags, titleUUID);

    return (await query(...constructedQuery)).rows;
}
