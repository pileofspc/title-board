import { postTags } from "~/server/services/tags";

export default defineEventHandler(async (event) => {
    const tags: TagPartial[] | TagPartial = await readBody(event);
    const query = getQuery(event);
    const titleUUID: string = Array.isArray(query.id) ? query.id[0] : query.id;

    // try {
    //     if (Array.isArray(tags)) {
    //         postTags(tags, titleUUID);
    //     }
    // } catch (error) {}

    return 0;
});
