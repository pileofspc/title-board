import { handlePostTags } from "~/server/services/tags";

export default defineEventHandler(async (event) => {
    return handleErrors(async () => {
        const body: {
            titleUUID: string;
            tags: TagPartial[];
        } = await readBody(event);

        return query(async (sqlClient) => {
            return await handlePostTags(sqlClient, body.tags, body.titleUUID);
        });
    });
});
