import pg from "pg";

const pool = new pg.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
});

export async function query(text: string, values?: unknown[]) {
    return pool.query(text, values);
}

// export async function makeTransaction(queries: string[], values: unknown[][]) {
//     const client = await pool.connect();
//     try {
//         await client.query("BEGIN");
//         for (const query of queries) {
//             await client.query(query);
//         }
//         await client.query("COMMIT");
//     } catch (error) {
//         await client.query("ROLLBACK");
//         throw error;
//     } finally {
//         client.release();
//     }
// }

export async function queryTransaction(subqueries: CustomQuery[]) {
    return pool.connect().then((client) => {
        client
            .query("BEGIN")
            .then(() =>
                Promise.all(
                    subqueries.map((query) => client.query(query[0], query[1]))
                )
            )
            .then(() => client.query("COMMIT"))
            .catch((e) => client.query("ROLLBACK"))
            .finally(() => client.release());
    });
}
