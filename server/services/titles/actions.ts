import { construct } from "./queryConstructor";

export const actions = {
    async postTitle(
        sqlClient: SqlClient,
        title: TitleServerPartial,
        titleUUID?: string
    ) {
        return await sqlClient.query(construct.postTitle(title, titleUUID));
    },
    async updateTitle(sqlClient: SqlClient, title: TitleServer) {
        return await sqlClient.query(construct.updateTitle(title));
    },
    async deleteTitle(sqlClient: SqlClient, titleUUID: string) {
        return await sqlClient.query(construct.deleteTitle(titleUUID));
    },
    async getTitles(sqlClient: SqlClient, perpage: number, offset: number) {
        return await sqlClient.query(construct.getTitles(perpage, offset));
    },
    async getAllTitles(sqlClient: SqlClient) {
        return await sqlClient.query(construct.getAllTitles());
    },
    async getTitlesCount(sqlClient: SqlClient): Promise<number> {
        return (await sqlClient.query(construct.getTitlesCount()))[0].count;
    },
};
