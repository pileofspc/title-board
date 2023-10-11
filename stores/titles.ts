import { v4 as uuidv4 } from "uuid";

let table: Title[] = [
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

function findTitle(titleId: string) {
    return table.find((item) => item.id === titleId);
}
function deepCopy<T extends Record<PropertyKey, any>>(target: T): DeepCopy<T> {
    return JSON.parse(JSON.stringify(target));
}

export const useTitlesStore = defineStore("titles", () => {
    const titlesState = ref(table);
    const titles = computed(() => titlesState.value);

    function updateExistingTitle(res: ApiResponse<Title>) {
        if (!res.success) {
            return res;
        }
        titlesState.value[
            titlesState.value.findIndex((item) => item.id === res.data.id)
        ] = res.data;
        return res;
    }

    function fetchTitles() {
        return new Promise<ApiResponse<Title[]>>((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: deepCopy(table),
                });
            }, 200);
        }).then((res) => {
            if (res.success) {
                titlesState.value = res.data;
            }
            return res;
        });
    }

    function addTitle(title: Title) {
        return new Promise<ApiResponse<Title[]>>((resolve) => {
            setTimeout(() => {
                table = [deepCopy(title), ...table];
                // table.push(deepCopy(title));
                resolve({
                    success: true,
                    data: deepCopy(table),
                });
            }, 2000);
        }).then((res) => {
            if (res.success) {
                titlesState.value = res.data;
            }
            return res;
        });
    }

    function removeTitle(titleId: string) {
        return new Promise<ApiResponse<Title>>((resolve) => {
            setTimeout(() => {
                const title = findTitle(titleId);
                if (title) {
                    table = table.filter((title) => title.id !== titleId);
                    resolve({
                        success: true,
                        data: deepCopy(title),
                    });
                } else {
                    resolve({
                        success: false,
                    });
                }
            }, 2000);
        }).then((res) => {
            if (res.success) {
                titlesState.value = titlesState.value.filter(
                    (item) => item.id !== res.data.id
                );
            }
            return res;
        });
    }

    function rateTitle(titleId: string, rating: number) {
        return new Promise<ApiResponse<Title>>((resolve) => {
            setTimeout(() => {
                const title = findTitle(titleId);
                if (title) {
                    title.rating = rating;
                    resolve({
                        success: true,
                        data: deepCopy(title),
                    });
                } else {
                    resolve({
                        success: false,
                    });
                }
            }, 2000);
        }).then(updateExistingTitle);
    }

    function addTag(titleId: string, tag: Tag) {
        return new Promise<ApiResponse<Title>>((resolve) => {
            setTimeout(() => {
                // тут присвоение типа и uuid временно пока нет фетчинга
                tag.id = uuidv4();
                const title = findTitle(titleId);

                if (title) {
                    title.tags.push(tag);
                    resolve({
                        success: true,
                        data: deepCopy(title),
                    });
                } else {
                    resolve({
                        success: false,
                    });
                }
            }, 3000);
        }).then(updateExistingTitle);
    }

    function removeTag(titleId: string, tag: Tag) {
        return new Promise<ApiResponse<Title>>((resolve) => {
            setTimeout(() => {
                const title = findTitle(titleId);

                if (title) {
                    title.tags = title.tags.filter(
                        (item) => item.id !== tag.id
                    );
                    resolve({
                        success: true,
                        data: deepCopy(title),
                    });
                } else {
                    resolve({
                        success: false,
                    });
                }
            }, 300);
        }).then(updateExistingTitle);
    }

    function changeTitleStatus(titleId: string, status: TitleStatus) {
        return new Promise<ApiResponse<Title>>((resolve) => {
            setTimeout(() => {
                const title = findTitle(titleId);

                if (title) {
                    title.status = status;
                    resolve({
                        success: true,
                        data: deepCopy(title),
                    });
                } else {
                    resolve({
                        success: false,
                    });
                }
            }, 3000);
        }).then(updateExistingTitle);
    }

    function changeTitleName(titleId: string, name: string) {
        return new Promise<ApiResponse<Title>>((resolve) => {
            setTimeout(() => {
                const title = findTitle(titleId);

                if (title) {
                    title.name = name;
                    resolve({
                        success: true,
                        data: deepCopy(title),
                    });
                } else {
                    resolve({
                        success: false,
                    });
                }
            }, 2000);
        }).then(updateExistingTitle);
    }

    function changeTitleDescription(titleId: string, description: string) {
        return new Promise<ApiResponse<Title>>((resolve) => {
            setTimeout(() => {
                const title = findTitle(titleId);

                if (title) {
                    title.description = description;
                    resolve({
                        success: true,
                        data: deepCopy(title),
                    });
                } else {
                    resolve({
                        success: false,
                    });
                }
            }, 2000);
        }).then(updateExistingTitle);
    }

    async function changeTitlePoster(titleId: string, poster: TitlePoster) {
        const title = findTitle(titleId);
        if (title && "imgFileBase64" in poster && poster.imgFileBase64) {
            if (title?.poster?.img) {
                URL.revokeObjectURL(title.poster.img);
            }
            const blob = await fetch(poster.imgFileBase64).then((res) =>
                res.blob()
            );
            poster.img = URL.createObjectURL(blob);
            delete poster.imgFileBase64;

            return new Promise<ApiResponse<Title>>((resolve) => {
                setTimeout(() => {
                    title.poster = poster;
                    resolve({
                        success: true,
                        data: deepCopy(title),
                    });
                }, 2000);
            }).then(updateExistingTitle);
        }

        if (title) {
            console.log(1);
            return new Promise<ApiResponse<Title>>((resolve) => {
                setTimeout(() => {
                    title.poster = poster;
                    resolve({
                        success: true,
                        data: deepCopy(title),
                    });
                }, 2000);
            }).then(updateExistingTitle);
        }

        return new Promise<ApiResponse<Title>>((resolve) => {
            setTimeout(() => {
                resolve({
                    success: false,
                });
            }, 2000);
        });
    }

    return {
        titles,
        fetchTitles,
        addTitle,
        removeTitle,
        changeTitleName,
        changeTitleDescription,
        changeTitlePoster,
        changeTitleStatus,
        rateTitle,
        addTag,
        removeTag,
    };
});
