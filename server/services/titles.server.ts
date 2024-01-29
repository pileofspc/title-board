import { query } from "~/server/utils/db.server";

const defaultTitle = {
    name: "Новый тайтл",
    description: "Описание нового тайтла",
    status: "NOT_WATCHED",
    pos_x: 50,
    pos_y: 50,
    tags: [],
};

export async function updateTitle(title: TitleServer): Promise<TitleServer[]> {
    return (
        await query(
            `UPDATE titles
            SET name = $2,
                description = $3,
                rating = $4,
                img = $5,
                link = $6,
                pos_x = $7,
                pos_y = $8,
                status = $9
            WHERE uuid = $1
            RETURNING *
        `,
            [
                title.uuid,
                title.name || defaultTitle.name,
                title.description || defaultTitle.description,
                title.rating,
                title.img,
                title.link,
                title.pos_x || defaultTitle.pos_x,
                title.pos_y || defaultTitle.pos_y,
                title.status || defaultTitle.status,
            ]
        )
    ).rows[0];
}

export async function addTitle(
    title: TitleServerPartial
): Promise<TitleServer[]> {
    return (
        await query(
            "INSERT INTO titles(name, description, rating, img, link, pos_x, pos_y, status) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [
                title.name || defaultTitle.name,
                title.description || defaultTitle.description,
                title.rating,
                title.img,
                title.link,
                title.pos_x || defaultTitle.pos_x,
                title.pos_y || defaultTitle.pos_y,
                title.status || defaultTitle.status,
            ]
        )
    ).rows[0];
}

export async function deleteTitle(titleId: string): Promise<TitleServer[]> {
    return (await query("DELETE FROM titles WHERE uuid = $1", [titleId])).rows;
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
    return (await query("SELECT * FROM titles ORDER BY id DESC")).rows;
}
export async function getTitles(
    perpage: number,
    offset: number
): Promise<TitleServer[]> {
    return (
        await query(
            "SELECT * FROM titles ORDER BY id DESC LIMIT $1 OFFSET $2",
            [perpage, offset]
        )
    ).rows;
}
