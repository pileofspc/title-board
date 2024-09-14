import { z } from "zod";
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
    img: z.string().max(1024).optional(),
    link: z.string().max(1024).optional(),
    pos_x: z.number().optional(),
    pos_y: z.number().optional(),
    rating: z.number().optional(),
    // tags: ????
});
const titlesSchema = z.array(titleSchema);

export const validate = {
    title: (title: TitlePartial) => titleSchema.parse(title),
    titles: (titles: TitlePartial[]) => titlesSchema.parse(titles),
};
