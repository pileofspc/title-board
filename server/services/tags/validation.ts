import { z, ZodError } from "zod";
import { colors, MAX_TAGS_PER_TITLE } from "~/constants";
import { actions } from "./actions";

const tagSchema = z.object({
    color: z.string().refine((color) => colors.includes(color as Color)),
    text: z.string().max(50),
    title_uuid: z.string().uuid().optional(),
    uuid: z.string().uuid().optional(),
});
const tagsSchema = z.array(tagSchema);

export const validate = {
    tag: (tag: TagPartial) => {
        try {
            tagSchema.safeParse(tag);
        } catch (e) {
            const error = e as ZodError;
            throw new ValidationError(
                error.issues.map((issue) => issue.message)
            );
        }
    },
    tags: (tags: TagPartial[]) => {
        try {
            tagsSchema.parse(tags);
        } catch (e) {
            const error = e as ZodError;
            throw new ValidationError(
                error.issues.map((issue) => issue.message)
            );
        }
    },
    async tagsAmount(newTagsAmount: number, titleUUID: string) {
        const existingTagsAmount = await queryV2(async (sqlClient) => {
            return await actions.getTagsCount(sqlClient, titleUUID);
        });

        if (existingTagsAmount + newTagsAmount <= MAX_TAGS_PER_TITLE) {
            return true;
        } else {
            throw new ValidationError([
                `Превышен допустимый максимум тегов - ${MAX_TAGS_PER_TITLE} на один тайтл`,
            ]);
        }
    },
};
