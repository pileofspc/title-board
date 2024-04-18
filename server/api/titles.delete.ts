import { deleteTitle } from "~/server/services/titles.service";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const [, error] = await handleAsync(deleteTitle(body.uuid));

    if (error) {
        respondWithError(event);
        return;
    }

    return;
});
