import { query } from "./utils/db.server";

// export let titles: Title[] = [
//     {
//         id: "1",
//         name: "Атака титанов",
//         description: "Ну аниме и аниме",
//         status: "WATCHED",
//         rating: 0,
//         poster: {
//             img: "https://www.kino-teatr.ru/news/23181/205114.jpg",
//             position: {
//                 x: 50,
//                 y: 100,
//             },
//         },
//         tags: [
//             {
//                 id: "t1",
//                 color: "red",
//                 text: "red",
//             },
//             {
//                 id: "t2",
//                 color: "green",
//                 text: "green",
//             },
//             {
//                 id: "t3",
//                 color: "blue",
//                 text: "blue",
//             },
//         ],
//     },
//     {
//         id: "2",
//         name: "Тетрадь смерти",
//         description: "Аниме ну и аниме",
//         status: "WANT_TO_WATCH",
//         rating: 5,
//         tags: [
//             {
//                 id: "t1",
//                 color: "blue",
//                 text: "blue",
//             },
//             {
//                 id: "t2",
//                 color: "green",
//                 text: "green",
//             },
//         ],
//     },
//     {
//         id: "3",
//         name: "Человек-бензопила",
//         description: "И аниме ну аниме",
//         status: "NOT_WATCHED",
//         rating: 2,
//         tags: [
//             {
//                 id: "t1",
//                 color: "red",
//                 text: "red",
//             },
//             {
//                 id: "t2",
//                 color: "green",
//                 text: "green",
//             },
//             {
//                 id: "t3",
//                 color: "blue",
//                 text: "blue",
//             },
//             {
//                 id: "t4",
//                 color: "indigo",
//                 text: "blueasdfhdsf",
//             },
//             {
//                 id: "t5",
//                 color: "amber",
//                 text: "fsdfjdsfhdsg",
//             },
//         ],
//     },
//     {
//         id: "4",
//         name: "Дороро",
//         description: "Аниме аниме ну и",
//         status: "NOT_WATCHED",
//         rating: 8,
//         tags: [
//             {
//                 id: "t1",
//                 color: "red",
//                 text: "red",
//             },
//             {
//                 id: "t2",
//                 color: "green",
//                 text: "green",
//             },
//             {
//                 id: "t3",
//                 color: "blue",
//                 text: "blue",
//             },
//         ],
//     },
// ];
// export function findTitle(titleId: string) {
//     return titles.find((item) => item.id === titleId);
// }
export async function addTitle(title: Title) {
    // titles.unshift(title);
    // console.log(await query("SELECT * FROM titles"));
    // id: '73bdb104-c262-40aa-85b9-27ddc5bbcd83',
    // name: null,
    // description: null,
    // rating: 5,
    // img: null,
    // link: null,
    // pos_x: null,
    // pos_y: null
    // await query(`INSERT INTO titles(name, description, rating, img, link, pos_x, pos_y)
    // VALUES('${title.name}', '${title.description}', '${title.rating}', '${
    //     title.poster?.img ||
    //     "https://www.ixbt.com/img/n1/news/2022/5/0/dobro.JPG"
    // }', '${title.poster?.link || "https://www.youtube.com/"}', '${
    //     title.poster?.position?.x || 50
    // }', '${title.poster?.position?.y || 50}')`);

    await query(`INSERT INTO titles(name, description, rating, img, link, pos_x, pos_y, status)
    VALUES('Новый тайтл', 'хеллоу', '5', 'https://www.ixbt.com/img/n1/news/2022/5/0/dobro.JPG', 'https://www.youtube.com/', '50', '50', 'NOT_WATCHED')`);
    return await getTitles();
}
// export function removeTitle(titleId: string) {
//     titles = titles.filter((title) => title.id !== titleId);
// }
// export function editTitle(titleId: string, newTitle: Title) {
//     titles[titles.findIndex((item) => item.id === titleId)] = newTitle;
// }

export async function getTitles(): Promise<TitleServer[]> {
    try {
        return (await query("SELECT * FROM titles")).rows;
    } catch (e) {
        console.log("ошибка");
        return [];
    }
}
