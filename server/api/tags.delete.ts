import { handleDeleteTag } from "~/server/services/tags";
import { tagsValidator } from "~/server/services/tags/validation";

export default defineEventHandler(
    withErrorHandling(async (event) => {
        const body = await readBody(event);
        const tag = tagsValidator.tag(body);

        return query(async (sqlClient) => {
            return await handleDeleteTag(sqlClient, tag.uuid);
        });
    })
);
