import { addTitle } from "@/server/titles.server";

export default defineEventHandler(async (event) => {
    const title: TitleServer = await readBody(event);
    return await addTitle(title);
});
