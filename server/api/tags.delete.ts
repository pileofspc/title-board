import { handleDeleteTag, handlePostTags } from "~/server/services/tags";

export default defineEventHandler(async (event) => {
    return handleErrors(async () => {
        const body: {
            titleUUID: string;
            tag: Tag;
        } = await readBody(event);

        return query(async (sqlClient) => {
            return await handleDeleteTag(sqlClient, body.tag);
        });
    });
});
