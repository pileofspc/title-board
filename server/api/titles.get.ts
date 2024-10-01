import { TTILES_PER_PAGE } from "~/constants";
import {
    handleGetTitles,
    handleGetAllTitles,
    handleGetTitlesCount,
} from "~/server/services/titles";

export default defineEventHandler(
    withErrorHandling(async (event) => {
        const queryString = getQuery(event);
        const page = Number(queryString.page) || 1;
        const perpage = Number(queryString.perpage) || TTILES_PER_PAGE;
        const offset = Math.max(page - 1, 0);

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
