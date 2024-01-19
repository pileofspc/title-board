import { deleteTitle } from "@/server/titles.server";

export default defineEventHandler(async (event) => {
    const id: string = await readBody(event);
    return await deleteTitle(id);
});
