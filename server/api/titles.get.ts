import {
    handleGetTitles,
    handleGetAllTitles,
    handleGetTitlesCount,
} from "~/server/services/titles";

export default defineEventHandler(async (event) =>
    handleErrors(async () => {
        // TODO: убрать хардкоженные значения
        const queryString = getQuery(event);
        const page = Number(queryString.page) || 1;
        const perpage = Number(queryString.perpage) || 10;
        const offset = Math.max(page - 1, 0);

        // TODO: сделать единообразно: либо везде trycatch либо везде handleAsync

        if (queryString.total) {
            return query(
                async (sqlClient) => await handleGetTitlesCount(sqlClient)
            );
        }

        if (queryString.page !== undefined) {
            return query(
                async (sqlClient) =>
                    await handleGetTitles(sqlClient, perpage, offset * perpage)
            );
        }

        return query(async (sqlClient) => await handleGetAllTitles(sqlClient));
    })
);
