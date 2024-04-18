import pg from "pg";

const pool = new pg.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
});

export async function query(query: CustomQuery) {
    if (query.skip) {
        throw new Error("Невозможно выполнить пустой запрос");
    }
    return (await pool.query(query.text, query.values)).rows;
}

export async function queryTransaction(subqueries: CustomQuery[]) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const results = [];
        for (const query of subqueries) {
            if (query.skip) {
                results.push(null);
                continue;
            }
            results.push((await client.query(query.text, query.values)).rows);
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
