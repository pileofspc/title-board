import { v4 as uuidv4 } from "uuid";

export const useTitlesStore = defineStore("titles", () => {
    const titlesState: Ref<Title[]> = ref([]);
    let mockJson: Title[] = [
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
    const titles = computed(() => titlesState.value);

    function findTitle(titleId: string) {
        return mockJson.find((item) => item.id === titleId);
    }

    function getTitlesCopy() {
        return JSON.parse(JSON.stringify(mockJson));
    }

    async function removeTitle(titleId: string) {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                mockJson = mockJson.filter((title) => title.id !== titleId);
                titlesState.value = getTitlesCopy();
                resolve();
            }, 2000);
        });
    }

    async function rateTitle(titleId: string, rating: number) {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                const foundTitle = findTitle(titleId);
                if (foundTitle) {
                    foundTitle.rating = rating;
                }

                titlesState.value = getTitlesCopy();
                resolve();
            }, 2000);
        });
    }

    async function fetchTitles() {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                titlesState.value = getTitlesCopy();
                resolve();
            }, 2000);
        });
    }

    async function addTag(titleId: string, tag: Tag) {
        // uuid временно пока нет фетчинга
        tag.id = uuidv4();
        const foundTitle = findTitle(titleId);

        if (foundTitle) {
            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    foundTitle.tags.push(tag);
                    titlesState.value = getTitlesCopy();
                    resolve();
                }, 3000);
            });
        }
    }

    async function removeTag(titleId: string, tag: Tag) {
        const foundTitle = findTitle(titleId);

        if (foundTitle) {
            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    foundTitle.tags = foundTitle.tags.filter(
                        (item) => item.id !== tag.id
                    );
                    titlesState.value = getTitlesCopy();
                    resolve();
                }, 3000);
            });
        }
    }

    async function changeTitleStatus(titleId: string, status: TitleStatus) {
        const foundTitle = findTitle(titleId);

        if (foundTitle) {
            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    foundTitle.status = status;
                    titlesState.value = getTitlesCopy();
                    resolve();
                }, 3000);
            });
        }
    }

    async function changeTitleName(titleId: string, name: string) {
        const foundTitle = findTitle(titleId);

        if (foundTitle) {
            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    foundTitle.name = name;
                    titlesState.value = getTitlesCopy();
                    resolve();
                }, 2000);
            });
        }
    }

    async function changeTitleDescription(
        titleId: string,
        description: string
    ) {
        const foundTitle = findTitle(titleId);

        if (foundTitle) {
            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    foundTitle.description = description;
                    titlesState.value = getTitlesCopy();
                    resolve();
                }, 2000);
            });
        }
    }

    async function changeTitlePoster(
        titleId: string,
        poster: TitlePoster | TitlePosterBlob
    ) {
        const foundTitle = findTitle(titleId);

        if (foundTitle) {
            return new Promise<void>((resolve) => {
                setTimeout(async () => {
                    if ("imgFileBase64" in poster && poster.imgFileBase64) {
                        const blob = await fetch(poster.imgFileBase64).then(
                            (res) => res.blob()
                        );
                        poster.img = URL.createObjectURL(blob);
                        delete poster.imgFileBase64;
                    }
                    foundTitle.poster = poster;
                    titlesState.value = getTitlesCopy();
                    resolve();
                }, 2000);
            });
        }
    }

    return {
        titles,
        fetchTitles,
        removeTitle,
        rateTitle,
        removeTag,
        addTag,
        changeTitleStatus,
        changeTitleName,
        changeTitleDescription,
        changeTitlePoster,
    };
});
