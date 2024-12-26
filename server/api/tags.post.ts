import { tagsRequestValidator } from "~/server/controllers/tags/validation";
import { handlePostTags } from "~/server/services/tags";
import { tagsValidator } from "~/server/services/tags/validation";

export default defineEventHandler(
    withErrorHandling(async (event) => {
        const unknownBody: unknown = await readBody(event);

        const test = {
            titleUUID: "asd",
            tags: "asdd",
        };

        const body = tagsRequestValidator.post(test);
        const tags = tagsValidator.tagsPartial(body.tags);

        return query(async (sqlClient) => {
            return await handlePostTags(sqlClient, tags, body.titleUUID);
        });
    })
);
