import {
    getTitles,
    getAllTitles,
    getTitlesTotal,
} from "~/server/titles.server";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const page = Number(query.page) || 0;
    const perpage = Number(query.perpage) || 10;
    // const filter = query.filter;
    // const sort = query.sort;

    const errorArgs = [
        event,
        500,
        "Ошибка при обращении к базе данных",
    ] as const;

    if (query.total) {
        try {
            return await getTitlesTotal();
        } catch (error) {
            setResponseStatus(...errorArgs);
            return 0;
        }
    }

    if (query.page !== undefined) {
        try {
            return await getTitles(perpage, page * perpage + 1);
        } catch (error) {
            setResponseStatus(...errorArgs);
            return [];
        }
    }

    try {
        return await getAllTitles();
    } catch (error) {
        setResponseStatus(...errorArgs);
        return [];
    }
});
