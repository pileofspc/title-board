import { handleDeleteTitle } from "~/server/services/titles";
import { validate } from "~/server/services/titles/validation";

export default defineEventHandler(
    withErrorHandling(async (event) => {
        const body: Title = await readBody(event);

        const title = validate.title(body);

        query(async (sqlClient) => {
            await handleDeleteTitle(sqlClient, body.uuid);
        });

        return;
    })
);
