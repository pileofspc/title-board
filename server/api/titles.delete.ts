import { handleDeleteTitle } from "~/server/services/titles";

export default defineEventHandler(
    withErrorHandling(async (event) => {
        const body: Title = await readBody(event);

        query(async (sqlClient) => {
            await handleDeleteTitle(sqlClient, body.uuid);
        });

        return;
    })
);
