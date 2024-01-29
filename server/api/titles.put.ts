import { updateTitle } from "~/server/services/titles.server";

export default defineEventHandler(async (event) => {
    const title: TitleServer = await readBody(event);

    const errorArgs = [
        event,
        500,
        "Ошибка при обращении к базе данных",
    ] as const;

    const [data, error] = await handleAsync(updateTitle(title));
    if (error) {
        setResponseStatus(...errorArgs);
        return;
    }

    return data;
});
