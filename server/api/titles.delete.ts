import { handleDeleteTitle } from "~/server/services/titles";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    query(async (sqlClient) => {
        await handleDeleteTitle(sqlClient, body.uuid);
    });

    return;
});
