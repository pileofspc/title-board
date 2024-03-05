import { updateTitle } from "~/server/services/titles.server";

export default defineEventHandler(async (event) => {
    const title: TitleServer = await readBody(event);

    function respondWithError() {
        setResponseStatus(event, 500, "Ошибка при обращении к базе данных");
    }

    const [data, error] = await handleAsync(updateTitle(title));
    if (error) {
        respondWithError();
        return;
    }

    return data;
});
