import { v4 as uuidv4 } from "uuid";
import { handlePostTags } from "~/server/services/tags";
import { handlePostTitle } from "~/server/services/titles";

export default defineEventHandler(async (event) =>
    handleErrors(async () => {
        const title: TitleServerPartial = await readBody(event);
        const uuid = uuidv4();
        title.uuid = uuid;

        return await transaction(async (sqlClient) => {
            return [
                await handlePostTitle(sqlClient, title, uuid),
                await handlePostTags(sqlClient, title.tags, uuid),
            ] as const;
        });
    })
);
