import { deleteTitle } from "~/server/services/titles.server";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const errorArgs = [
        event,
        500,
        "Ошибка при обращении к базе данных",
    ] as const;

    const [, error] = await handleAsync(deleteTitle(body.uuid));

    if (error) {
        setResponseStatus(...errorArgs);
        return;
    }

    return;
});
