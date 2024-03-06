import pg from "pg";

const pool = new pg.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
});

export async function query(query: CustomQuery) {
    return (await pool.query(query[0], query[1])).rows;
}

export async function queryTransaction(subqueries: CustomQuery[]) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const results = [];
        for (const query of subqueries) {
            results.push((await client.query(query[0], query[1])).rows);
        }
        await client.query("COMMIT");
        return results;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

// 1) getting a client
// 2) constructing a query
// 3) deciding what to return from that query
// 4) sending a query

// queryTransaction3(() => {
//     addTitle(title);
//     addTags(tags, title.uuid)
// })

// export async function queryTransaction2(
//     callback: (client: pg.PoolClient) => Promise<void>
// ) {
//     const client = await pool.connect();
//     try {
//         await client.query("BEGIN");
//         const results = [];

//         await callback(client);

//         await client.query("COMMIT");
//         return results;
//     } catch (error) {
//         await client.query("ROLLBACK");
//         throw error;
//     } finally {
//         client.release();
//     }
// }

// export async function queryTransaction(subqueries: CustomQuery[]) {
//     return pool.connect().then((client) => {
//         return client
//             .query("BEGIN")
//             .then(() =>
//                 Promise.all(
//                     subqueries.map((query) => client.query(query[0], query[1]))
//                 )
//             )
//             .then(() => client.query("COMMIT"))
//             .catch((e) => client.query("ROLLBACK"))
//             .finally(() => client.release());
//     });
// }
