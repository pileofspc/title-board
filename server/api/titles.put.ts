import { handleUpdateTitle } from "~/server/services/titles";

export default defineEventHandler(
    withErrorHandling(async (event) => {
        const title: Title = await readBody(event);

        return query(
            async (sqlClient) => await handleUpdateTitle(sqlClient, title)
        );
    })
);
