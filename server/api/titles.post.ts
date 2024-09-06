import { postTitle } from "~/server/services/titles";

export default defineEventHandler(async (event) => {
    const title: TitleServerPartial = await readBody(event);

    const [resultTitle, error] = await handleAsync(postTitle(title));
    if (error) respondWithError(event);

    return resultTitle;
});
