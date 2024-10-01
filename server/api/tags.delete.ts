import { handleDeleteTag } from "~/server/services/tags";

export default defineEventHandler(
    withErrorHandling(async (event) => {
        const body: {
            titleUUID: string;
            tag: Tag;
        } = await readBody(event);

        return query(async (sqlClient) => {
            return await handleDeleteTag(sqlClient, body.tag);
        });
    })
);
