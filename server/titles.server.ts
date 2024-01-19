import { query } from "./utils/db.server";

// export function editTitle(titleId: string, newTitle: Title) {
//     titles[titles.findIndex((item) => item.id === titleId)] = newTitle;
// }

export async function addTitle(title: TitleServer) {
    // VALUES('Новый тайтл', 'хеллоу', '5', 'https://www.ixbt.com/img/n1/news/2022/5/0/dobro.JPG', 'https://www.youtube.com/', '50', '50', 'NOT_WATCHED'),

    return await query(
        "INSERT INTO titles(name, description, rating, img, link, pos_x, pos_y, status) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;",
        [
            title.name,
            title.description,
            title.rating,
            title.img,
            title.link,
            title.pos_x,
            title.pos_y,
            title.status,
        ]
    );
}

export async function deleteTitle(titleId: string) {
    return await query("DELETE FROM titles WHERE id = $1", [titleId]);
}

export async function getTitlesTotal(): Promise<number> {
    // Код для определения ПРИМЕРНОГО количества записей
    // return (
    //     await query(
    //         "SELECT reltuples FROM pg_class WHERE oid = 'public.titles'::regclass;"
    //     )
    // )?.rows[0]?.reltuples;
    return (await query("SELECT COUNT(*) FROM titles"))?.rows[0].count;
}

export async function getAllTitles(): Promise<TitleServer[]> {
    return (await query("SELECT * FROM titles")).rows;
}
export async function getTitles(
    perpage: number,
    offset: number
): Promise<TitleServer[]> {
    const result = await query(
        "SELECT * FROM titles ORDER BY id DESC LIMIT $1 OFFSET $2",
        [perpage, offset]
    );

    return result.rows;
}
