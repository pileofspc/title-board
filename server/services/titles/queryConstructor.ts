import { defaultTitle } from "~/constants";
import { CustomQuery } from "#imports";

export const construct = {
    getTitles(perpage: number, offset: number): CustomQuery<Title[]> {
        return new CustomQuery(
            `SELECT titles.*, COALESCE(json_agg(tags.*) FILTER(WHERE tags.title_uuid IS NOT NULL), '[]') AS tags FROM titles
            LEFT JOIN tags ON titles.uuid = tags.title_uuid
            GROUP BY titles.uuid
            ORDER BY titles.id DESC LIMIT $1 OFFSET $2`,
            [perpage, offset]
        );
    },
    getAllTitles(): CustomQuery<Title[]> {
        return new CustomQuery(`SELECT titles.*, COALESCE(json_agg(tags.*) FILTER(WHERE tags.title_uuid IS NOT NULL), '[]') AS tags FROM titles
            LEFT JOIN tags ON titles.uuid = tags.title_uuid
            GROUP BY titles.uuid
            ORDER BY titles.id DESC`);
    },
    getAllTitlesWithoutTags(): CustomQuery<Title[]> {
        return new CustomQuery(`
            SELECT * FROM titles
            ORDER BY titles.id DESC`);
    },
    getTitlesCount(): CustomQuery<[{ count: number }]> {
        return new CustomQuery("SELECT COUNT(*) FROM titles");
    },
    postTitle(
        title: TitleServerPartial,
        titleUUID?: string
    ): CustomQuery<[Title]> {
        return new CustomQuery(
            `INSERT INTO titles(uuid, name, description, rating, img, link, pos_x, pos_y, status)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [
                titleUUID,
                title.name || defaultTitle.name,
                title.description || defaultTitle.description,
                title.rating,
                title.img,
                title.link,
                title.pos_x || defaultTitle.pos_x,
                title.pos_y || defaultTitle.pos_y,
                title.status || defaultTitle.status,
            ]
        );
    },
    updateTitle(title: TitleServer): CustomQuery<[Title]> {
        return new CustomQuery(
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
        );
    },
    deleteTitle(titleUUID: string): CustomQuery<[]> {
        return new CustomQuery("DELETE FROM titles WHERE uuid = $1", [
            titleUUID,
        ]);
    },

    getTags(titleUUID: string): CustomQuery<Tag[]> {
        return new CustomQuery(
            `SELECT * FROM tags
            WHERE title_uuid = $1
            ORDER BY created_at, id DESC`,
            [titleUUID]
        );
    },
    getTagsCount(titleUUID: string): CustomQuery<[{ count: number }]> {
        return new CustomQuery(
            `SELECT COUNT(*) FROM tags
            WHERE title_uuid = $1`,
            [titleUUID]
        );
    },
    postTag(tag: TagPartial, titleUUID: string): CustomQuery<[Tag]> {
        return new CustomQuery(
            `INSERT INTO tags(text, color, title_uuid) VALUES(
                $1, $2, $3
            )`,
            [tag.text, tag.color, titleUUID]
        );
    },
    postTags(tags: TagPartial[], titleUUID: string): CustomQuery<Tag[]> {
        let counter = 1;
        let text = "INSERT INTO tags(text, color, title_uuid) VALUES";
        for (let i = 0; i < tags.length; i++) {
            if (i > 0) {
                text += ", ";
            }
            text += `($${counter++}, $${counter++}, $${counter++})`;
        }
        text += " RETURNING *";

        const values: string[] = [];
        for (const tag of tags) {
            values.push(tag.text, tag.color, titleUUID);
        }

        return new CustomQuery(text, values);
    },
    deleteTags(titleUUID: string): CustomQuery<[]> {
        return new CustomQuery("DELETE FROM tags WHERE title_uuid = $1", [
            titleUUID,
        ]);
    },
};
