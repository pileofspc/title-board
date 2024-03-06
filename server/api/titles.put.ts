import { updateTitle } from "~/server/services/titles.server";

export default defineEventHandler(async (event) => {
    const title: TitleServer = await readBody(event);

    const [data, error] = await handleAsync(updateTitle(title));
    if (error) {
        respondWithError(event);
        return;
    }

    return data;
});
