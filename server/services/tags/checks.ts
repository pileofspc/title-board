import { MAX_TAGS_PER_TITLE } from "~/constants";
import { actions } from "./actions";

export const checks = {
    async tagsAmountNotExceeded(newTagsAmount: number, titleUUID: string) {
        const existingTagsAmount = await query(async (sqlClient) => {
            return await actions.getTagsCount(sqlClient, titleUUID);
        });

        if (existingTagsAmount + newTagsAmount <= MAX_TAGS_PER_TITLE) {
            return true;
        } else {
            throw new BusinessError([
                `Превышен допустимый максимум тегов - ${MAX_TAGS_PER_TITLE} на один тайтл`,
            ]);
        }
    },
};
