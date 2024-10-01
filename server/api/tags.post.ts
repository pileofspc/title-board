import { handlePostTags } from "~/server/services/tags";
import { validate } from "~/server/services/tags/validation";

export default defineEventHandler(
    withErrorHandling(async (event) => {
        const body: {
            titleUUID: string;
            tags: TagPartial[];
        } = await readBody(event);

        return query(async (sqlClient) => {
            return await handlePostTags(sqlClient, body.tags, body.titleUUID);
        });
    })
);
