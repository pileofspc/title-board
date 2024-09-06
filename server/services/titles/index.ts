import { actions } from "./actions";

export async function postTitle(
    sqlClient: SqlClient,
    title: TitleServerPartial,
    titleUUID?: string
) {
    return await actions.postTitle(sqlClient, title, titleUUID);
}
export async function updateTitle(sqlClient: SqlClient, title: TitleServer) {
    return await actions.updateTitle(sqlClient, title);
}
export async function deleteTitle(sqlClient: SqlClient, titleUUID: string) {
    return await actions.deleteTitle(sqlClient, titleUUID);
}
export async function getTitles(
    sqlClient: SqlClient,
    perpage: number,
    offset: number
) {
    return await actions.getTitles(sqlClient, perpage, offset);
}
export async function getAllTitles(sqlClient: SqlClient) {
    return await actions.getAllTitles(sqlClient);
}
export async function getTitlesCount(sqlClient: SqlClient): Promise<number> {
    return await actions.getTitlesCount(sqlClient);
}
