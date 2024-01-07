import { addTitle } from "@/server/titles.server";

export default defineEventHandler(async (event) => {
    // const query = getQuery(event);
    // const page = query.page || 0;
    // const perpage = query.perpage || 10;
    // const filter = query.filter;
    // const sort = query.sort;
    const title: Title = await readBody(event);
    return await addTitle(title);
});
