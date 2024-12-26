import { TTILES_PER_PAGE } from "~/constants";
import {
    handleGetTitles,
    handleGetAllTitles,
    handleGetTitlesCount,
} from "~/server/services/titles";

export default defineEventHandler(
    withErrorHandling(async (event) => {
        const queryObject = getQuery(event);
        const page = Number(queryObject.page) || 1;
        const perpage = Number(queryObject.perpage) || TTILES_PER_PAGE;
        const offset = Math.max(page - 1, 0);

        if (queryObject.total) {
            return query(
                async (sqlClient) => await handleGetTitlesCount(sqlClient)
            );
        }

        if (queryObject.page !== undefined) {
            return query(
                async (sqlClient) =>
                    await handleGetTitles(sqlClient, perpage, offset * perpage)
            );
        }

        return query(async (sqlClient) => await handleGetAllTitles(sqlClient));
    })
);
