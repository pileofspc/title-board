import { z, ZodError } from "zod";
import { titleStatuses } from "~/constants";

const titleSchema = z.object({
    uuid: z.string().uuid().optional(),
    id: z.string().optional(),
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
    // TODO: сделать трансформации и уточнить валидацию
    pos_x: z.string().or(z.number()).nullish(),
    pos_y: z.string().or(z.number()).nullish(),
    rating: z.string().or(z.number()).nullish(),
});
const titlesSchema = z.array(titleSchema);

export const validate = {
    title: (title: unknown) => {
        try {
            return titleSchema.parse(title);
        } catch (e) {
            if (e instanceof ZodError) {
                throw new ValidationError(
                    e.issues.map((issue) => issue.message)
                );
            }

            throw e;
        }
    },
    titles: (titles: unknown) => {
        try {
            return titlesSchema.parse(titles);
        } catch (e) {
            if (e instanceof ZodError) {
                throw new ValidationError(
                    e.issues.map((issue) => issue.message)
                );
            } else {
                throw e;
            }
        }
    },
};
