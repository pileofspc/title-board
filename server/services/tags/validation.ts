import { z } from "zod";
import { colors } from "~/constants";

const tagSchema = z.object({
    color: z.enum(colors),
    text: z.string().max(50),
    title_uuid: z.string().uuid(),
    uuid: z.string().uuid(),
});
const tagPartialSchema = z.object({
    color: z.enum(colors),
    text: z.string().max(50),
    title_uuid: z.string().uuid().optional(),
    uuid: z.string().uuid().optional(),
});
const tagsSchema = z.array(tagSchema);
const tagsPartialSchema = z.array(tagPartialSchema);

class TagsValidator {
    @withRethrowingAsValidationError
    tag(tag: unknown) {
        return tagSchema.parse(tag);
    }

    @withRethrowingAsValidationError
    tagPartial(tag: unknown) {
        return tagPartialSchema.parse(tag);
    }

    @withRethrowingAsValidationError
    tags(tags: unknown) {
        return tagsSchema.parse(tags);
    }

    @withRethrowingAsValidationError
    tagsPartial(tags: unknown) {
        return tagsPartialSchema.parse(tags);
    }
}
export const tagsValidator = new TagsValidator();
