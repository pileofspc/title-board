import { v4 as uuidv4 } from "uuid";
import { handlePostTags } from "~/server/services/tags";
import { handlePostTitle } from "~/server/services/titles";
import { validate as validateTitles } from "~/server/services/titles/validation";
import { tagsValidator as validateTags } from "~/server/services/tags/validation";

export default defineEventHandler(
    withErrorHandling(async (event) => {
        const body: TitleServerPartial = await readBody(event);

        const uuid = uuidv4();
        const title = validateTitles.title(body);
        const tags = validateTags.tagsPartial(body.tags);
        title.uuid = uuid;

        return await transaction(async (sqlClient) => {
            return [
                await handlePostTitle(sqlClient, title, uuid),
                await handlePostTags(sqlClient, tags, uuid),
            ] as const;
        });
    })
);
