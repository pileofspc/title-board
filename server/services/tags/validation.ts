import { MAX_TAGS_PER_TITLE } from "~/constants";
import { queryV2 } from "~/server/utils/db";
import { actions } from "./actions";

export const validate = {
    async tagsAmount(newTagsAmount: number, titleUUID: string) {
        const existingTagsAmount = await queryV2(async (sqlClient) => {
            return await actions.getTagsCount(sqlClient, titleUUID);
        });
        return existingTagsAmount + newTagsAmount <= MAX_TAGS_PER_TITLE;
    },
};

// 1) должна ли валидация делать запросы?
