import {
    getTitles,
    getAllTitles,
    getTitlesCount,
} from "~/server/services/titles.service";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const page = Number(query.page) || 0;
    const perpage = Number(query.perpage) || 10;
    // const filter = query.filter;
    // const sort = query.sort;

    // TODO: сделать единообразно: либо везде trycatch либо везде handleAsync

    if (query.total) {
        const [data, error] = await handleAsync(getTitlesCount());
        if (error) {
            respondWithError(event);
            return 0;
        }

        return data;
    }

    if (query.page !== undefined) {
        const [data, error] = await handleAsync(
            getTitles(perpage, page * perpage)
        );
        if (error) {
            respondWithError(event);
            return [];
        }

        return data;
    }

    const [data, error] = await handleAsync(getAllTitles());
    if (error) {
        respondWithError(event);
        return [];
    }

    return data;
});
