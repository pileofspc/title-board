import { z } from "zod";

const schema = z.object({
    titleUUID: z.string(),
    tags: z.unknown(),
});

class TagsRequestValidator {
    @withRethrowingAsValidationError
    post(body: unknown) {
        return schema.parse(body);
    }
}

export const tagsRequestValidator = new TagsRequestValidator();
