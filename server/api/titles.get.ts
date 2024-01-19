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
        const [data, error] = await handleAsync(getTitlesTotal());
        if (error) {
            setResponseStatus(...errorArgs);
            return 0;
        }

        return data;
    }

    if (query.page !== undefined) {
        const [data, error] = await handleAsync(
            getTitles(perpage, page * perpage)
        );
        if (error) {
            setResponseStatus(...errorArgs);
            return [];
        }

        return data;
    }

    const [data, error] = await handleAsync(getAllTitles());
    if (error) {
        setResponseStatus(...errorArgs);
        return [];
    }

    return data;
});
