import { updateTitle } from "~/server/services/titles";

export default defineEventHandler(async (event) => {
    const title: TitleServer = await readBody(event);

    const [data, error] = await handleAsync(updateTitle(title));
    if (error) {
        return respondWithError(event);
    }

    return data;
});
