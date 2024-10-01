import { z, ZodError } from "zod";
import { colors } from "~/constants";

const tagSchema = z.object({
    color: z.string().refine((color) => colors.includes(color as Color)),
    text: z.string().max(50),
    title_uuid: z.string().uuid().nullish(),
    uuid: z.string().uuid().nullish(),
});
const tagsSchema = z.array(tagSchema);

export const validate = {
    tag: (tag: TagPartial) => {
        try {
            return tagSchema.parse(tag);
        } catch (e) {
            const error = e as ZodError;
            throw new ValidationError(
                error.issues.map((issue) => issue.message)
            );
        }
    },
    tags: (tags: TagPartial[]) => {
        try {
            return tagsSchema.parse(tags);
        } catch (e) {
            const error = e as ZodError;
            throw new ValidationError(
                error.issues.map((issue) => issue.message)
            );
        }
    },
};
