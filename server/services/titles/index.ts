import { validate } from "./validation";
import { actions } from "./actions";

export async function handlePostTitle(
    sqlClient: SqlClient,
    title: TitleServerPartial,
    titleUUID?: string
) {
    validate.title(title);
    return await actions.postTitle(sqlClient, title, titleUUID);
}
export async function handleUpdateTitle(
    sqlClient: SqlClient,
    title: TitleServer
) {
    validate.title(title);
    return await actions.updateTitle(sqlClient, title);
}
export async function handleDeleteTitle(
    sqlClient: SqlClient,
    titleUUID: string
) {
    return await actions.deleteTitle(sqlClient, titleUUID);
}
export async function handleGetTitles(
    sqlClient: SqlClient,
    perpage: number,
    offset: number
) {
    return await actions.getTitles(sqlClient, perpage, offset);
}
export async function handleGetAllTitles(sqlClient: SqlClient) {
    return await actions.getAllTitles(sqlClient);
}
export async function handleGetTitlesCount(
    sqlClient: SqlClient
): Promise<number> {
    return await actions.getTitlesCount(sqlClient);
}
