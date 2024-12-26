import { construct } from "./queryConstructor";

export const actions = {
    async postTags(
        sqlClient: SqlClient,
        tags: TagPartial[],
        titleUUID: string
    ) {
        return await sqlClient.query(construct.postTags(tags, titleUUID));
    },

    async deleteTag(sqlClient: SqlClient, tagUUID: string) {
        return await sqlClient.query(construct.deleteTag(tagUUID));
    },

    async getTags(sqlClient: SqlClient, titleUUIDs: string | string[]) {
        return await sqlClient.query(construct.getTags(titleUUIDs));
    },

    async getTagsCount(
        sqlClient: SqlClient,
        titleUUID: string
    ): Promise<number> {
        return (await sqlClient.query(construct.getTagsCount(titleUUID)))[0]
            .count;
    },
};
