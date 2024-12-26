import { handlePostTags } from "~/server/services/tags";
import { tagsValidator } from "~/server/services/tags/validation";

class TagsController {
    async get(requestBody: unknown) {}
    async post(requestBody: unknown) {
        const tags = tagsValidator.tagsPartial(body.tags);

        return query(async (sqlClient) => {
            return await handlePostTags(sqlClient, tags, body.titleUUID);
        });
    }
    async delete(requestBody: unknown) {
        const tags = tagsValidator.tagsPartial(body.tags);

        return query(async (sqlClient) => {
            return await handlePostTags(sqlClient, tags, body.titleUUID);
        });
    }
}

export const tagsController = new TagsController();
