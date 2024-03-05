import { addTags, addTitle } from "~/server/services/titles.server";

export default defineEventHandler(async (event) => {
    const title: TitleServerPartial = await readBody(event);

    function respondWithError() {
        setResponseStatus(event, 500, "Ошибка при обращении к базе данных");
    }

    const [responseTitle, errorTitle] = await handleAsync(addTitle(title));
    if (errorTitle) {
        respondWithError();
        return;
    }
    const [responseTags, errorTags] = await handleAsync(
        addTags(title.tags, responseTitle.uuid)
    );
    if (errorTags) {
        respondWithError();
        return;
    }

    responseTitle.tags = responseTags;

    return responseTitle;
});
