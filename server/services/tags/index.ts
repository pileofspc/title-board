import { validate } from "~/server/services/tags/validation";
import { actions } from "./actions";

export async function handlePostTags(
    sqlClient: SqlClient,
    tags: TagPartial[],
    titleUUID: string
) {
    if (await validate.tagsAmount(tags.length, titleUUID)) {
        return await actions.postTags(sqlClient, tags, titleUUID);
    } else {
        throw new Error("validation error");
    }
}

export async function handleDeleteTag(sqlClient: SqlClient, tag: Tag) {
    return await actions.deleteTag(sqlClient, tag);
}

export async function handleGetTags(sqlClient: SqlClient, titleUUID: string) {
    return await actions.getTags(sqlClient, titleUUID);
}

export async function handleGetTagsCount(
    sqlClient: SqlClient,
    titleUUID: string
): Promise<number> {
    return await actions.getTagsCount(sqlClient, titleUUID);
}
