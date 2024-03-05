import { deleteTitle } from "~/server/services/titles.server";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    function respondWithError() {
        setResponseStatus(event, 500, "Ошибка при обращении к базе данных");
    }

    const [, error] = await handleAsync(deleteTitle(body.uuid));

    if (error) {
        respondWithError();
        return;
    }

    return;
});
