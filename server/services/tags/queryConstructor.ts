export const construct = {
    updateTag(tag: TagPartial, tagUUID: string): CustomQuery<Tag[]> {
        return new CustomQuery(
            `UPDATE tags
            SET text = $2,
                color = $3,
            WHERE uuid = $1
            RETURNING *
            `,
            [tagUUID, tag.text, tag.color]
        );
    },
    postTags(tags: TagPartial[], titleUUID: string): CustomQuery<Tag[]> {
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

        return new CustomQuery<Tag[]>(text, values);
    },
    deleteTag(tagUUID: string): CustomQuery<void> {
        return new CustomQuery<void>("DELETE FROM tags WHERE title_uuid = $1", [
            tagUUID,
        ]);
    },
    getTags(titleUUIDs: string | string[]): CustomQuery<Tag[]> {
        return new CustomQuery<Tag[]>(
            `SELECT * FROM tags
            WHERE ${Array.isArray(titleUUIDs) ? "title_uuid IN $1" : "title_uuid = $1"}
            ORDER BY created_at, id DESC`,
            [titleUUIDs]
        );
    },
    getTagsCount(titleUUID: string): CustomQuery<[{ count: number }]> {
        return new CustomQuery<[{ count: number }]>(
            `SELECT COUNT(*) FROM tags
            WHERE title_uuid = $1`,
            [titleUUID]
        );
    },
    deleteTags(titleUUID: string): CustomQuery<void> {
        return new CustomQuery<void>("DELETE FROM tags WHERE title_uuid = $1", [
            titleUUID,
        ]);
    },
};
