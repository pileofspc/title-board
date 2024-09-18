import { z, ZodError } from "zod";
import { titleStatuses } from "~/constants";

const titleSchema = z.object({
    uuid: z.string().uuid().nullish(),
    id: z.string().nullish(),
    name: z.string().max(255),
    description: z.string().max(1024),
    status: z
        .string()
        .refine(
            (status): status is TitleStatus =>
                !!titleStatuses?.[status as TitleStatus]
        ),
    img: z.string().max(1024).nullish(),
    link: z.string().max(1024).nullish(),
    pos_x: z.number().nullish(),
    pos_y: z.number().nullish(),
    rating: z.number().nullish(),
});
const titlesSchema = z.array(titleSchema);

export const validate = {
    title: (title: TitlePartial) => {
        try {
            titleSchema.parse(title);
        } catch (e) {
            const error = e as ZodError;
            throw new ValidationError(
                error.issues.map((issue) => issue.message)
            );
        }
    },
    titles: (titles: TitlePartial[]) => {
        try {
            titlesSchema.parse(titles);
        } catch (e) {
            const error = e as ZodError;
            throw new ValidationError(
                error.issues.map((issue) => issue.message)
            );
        }
    },
};
