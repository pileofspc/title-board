import { tagsValidator } from "./validation";
import { actions } from "./actions";
import { checks } from "~/server/services/tags/checks";

export async function handlePostTags(
    sqlClient: SqlClient,
    tags: TagPartial[],
    titleUUID: string
) {
    tagsValidator.tags(tags);
    await checks.tagsAmountNotExceeded(tags.length, titleUUID);
    return await actions.postTags(sqlClient, tags, titleUUID);
}

export async function handleDeleteTag(sqlClient: SqlClient, tagUUID: string) {
    return await actions.deleteTag(sqlClient, tagUUID);
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
