import { handleUpdateTitle } from "~/server/services/titles";

export default defineEventHandler(async (event) =>
    handleErrors(async () => {
        const title: TitleServer = await readBody(event);

        return query(
            async (sqlClient) => await handleUpdateTitle(sqlClient, title)
        );
    })
);
