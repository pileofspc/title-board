import { validate } from "./validation";
import { actions } from "./actions";

export async function handlePostTags(
    sqlClient: SqlClient,
    tags: TagPartial[],
    titleUUID: string
) {
    validate.tags(tags);
    await validate.tagsAmount(tags.length, titleUUID);
    return await actions.postTags(sqlClient, tags, titleUUID);
}

export async function handleDeleteTag(sqlClient: SqlClient, tag: Tag) {
    return await actions.deleteTag(sqlClient, tag);
}

export async function handleGetTags(
    sqlClient: SqlClient,
    titleUUIDs: string | string[]
) {
    return await actions.getTags(sqlClient, titleUUIDs);
}

export async function handleGetTagsCount(
    sqlClient: SqlClient,
    titleUUID: string
): Promise<number> {
    return await actions.getTagsCount(sqlClient, titleUUID);
}
