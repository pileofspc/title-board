export let titles: Title[] = [
    {
        id: "1",
        name: "Атака титанов",
        description: "Ну аниме и аниме",
        status: "WATCHED",
        rating: 0,
        poster: {
            img: "https://www.kino-teatr.ru/news/23181/205114.jpg",
            position: {
                x: 50,
                y: 100,
            },
        },
        tags: [
            {
                id: "t1",
                color: "red",
                text: "red",
            },
            {
                id: "t2",
                color: "green",
                text: "green",
            },
            {
                id: "t3",
                color: "blue",
                text: "blue",
            },
        ],
    },
    {
        id: "2",
        name: "Тетрадь смерти",
        description: "Аниме ну и аниме",
        status: "WANT_TO_WATCH",
        rating: 5,
        tags: [
            {
                id: "t1",
                color: "blue",
                text: "blue",
            },
            {
                id: "t2",
                color: "green",
                text: "green",
            },
        ],
    },
    {
        id: "3",
        name: "Человек-бензопила",
        description: "И аниме ну аниме",
        status: "NOT_WATCHED",
        rating: 2,
        tags: [
            {
                id: "t1",
                color: "red",
                text: "red",
            },
            {
                id: "t2",
                color: "green",
                text: "green",
            },
            {
                id: "t3",
                color: "blue",
                text: "blue",
            },
            {
                id: "t4",
                color: "indigo",
                text: "blueasdfhdsf",
            },
            {
                id: "t5",
                color: "amber",
                text: "fsdfjdsfhdsg",
            },
        ],
    },
    {
        id: "4",
        name: "Дороро",
        description: "Аниме аниме ну и",
        status: "NOT_WATCHED",
        rating: 8,
        tags: [
            {
                id: "t1",
                color: "red",
                text: "red",
            },
            {
                id: "t2",
                color: "green",
                text: "green",
            },
            {
                id: "t3",
                color: "blue",
                text: "blue",
            },
        ],
    },
];
export function findTitle(titleId: string) {
    return titles.find((item) => item.id === titleId);
}
export function addTitle(title: Title) {
    // titles.unshift(title);
}
export function removeTitle(titleId: string) {
    titles = titles.filter((title) => title.id !== titleId);
}
export function editTitle(titleId: string, newTitle: Title) {
    titles[titles.findIndex((item) => item.id === titleId)] = newTitle;
}
