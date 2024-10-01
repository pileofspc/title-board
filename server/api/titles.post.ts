import { v4 as uuidv4 } from "uuid";
import { handlePostTags } from "~/server/services/tags";
import { handlePostTitle } from "~/server/services/titles";

export default defineEventHandler(
    withErrorHandling(async (event) => {
        const body: TitleServerPartial = await readBody(event);
        const uuid = uuidv4();
        body.uuid = uuid;

        return await transaction(async (sqlClient) => {
            return [
                await handlePostTitle(sqlClient, body, uuid),
                await handlePostTags(sqlClient, body.tags, uuid),
            ] as const;
        });
    })
);
