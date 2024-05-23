import { FetchError } from "ofetch";

export const useTitlesStore = defineStore("titles", () => {
    const isLoadingPages = ref(false);
    const isLoadingTitles = ref(false);
    const pages = ref(0);
    const PER_PAGE = 10;
    const { data: titles } = useFetch("/api/titles", {
        params: {
            page: useRoute().query.page || 1,
            perpage: PER_PAGE,
        },
        transform: mapToClient,
        default: () => [],
    });

    // TODO: Привести Title и TitleServer к единому виду или хотя бы прилично переделать эту функцию с правильной типизацией
    function mapToClient(titles: TitleServer[]): Title[] {
        return titles.map((item) => {
            const result: Title = {
                id: item.id,
                uuid: item.uuid,
                name: item.name,
                description: item.description,
                status: item.status,
                rating: item.rating,
                poster: {
                    img: item.img,
                    link: item.link,
                },
                tags: item.tags,
            };

            if (
                result.poster &&
                typeof item.pos_x === "number" &&
                typeof item.pos_y === "number"
            ) {
                result.poster.position = {
                    x: item.pos_x,
                    y: item.pos_y,
                };
            }
            return result;
        });
    }
    function mapToServerPartial(
        titles: Title[] | TitlePartial[]
    ): TitleServerPartial[] {
        return titles.map((item) => {
            return {
                id: item.id,
                uuid: item.uuid,
                name: item.name,
                description: item.description,
                rating: item.rating,
                img: item.poster?.img,
                link: item.poster?.link,
                pos_x: item.poster?.position?.x,
                pos_y: item.poster?.position?.y,
                status: item.status,
                tags: item.tags,
            };
        });
    }

    // TODO: нужны ли эти проверки typeof smth === 'number'?

    const fetchPagesAmount = decorateWithLoadingManagement(
        async function fetchPagesAmount() {
            try {
                const response = await $fetch<number>("/api/titles", {
                    params: {
                        total: true,
                    },
                });

                if (typeof response === "number") {
                    pages.value = Math.ceil(response / PER_PAGE);
                }
            } catch (e) {
                const error = e as FetchError;
                console.error(
                    `Ошибка при запросе на сервер: ${error?.message}`
                );
            }
        },
        isLoadingPages
    );

    const fetchTitles = decorateWithLoadingManagement(
        async function fetchTitles(page?: number) {
            try {
                const response = await $fetch<TitleServer[]>("/api/titles", {
                    params: {
                        perpage: String(PER_PAGE),
                        page:
                            typeof page === "number" && page >= 0
                                ? `${page}`
                                : "0",
                    },
                });
                titles.value = mapToClient(response);

                fetchPagesAmount();
            } catch (e) {
                const error = e as FetchError;
                console.error(`Ошибка при запросе на сервер: ${error.message}`);
            }
        },
        isLoadingTitles
    );

    async function addTitle(title: TitlePartial) {
        const mappedTitle = mapToServerPartial([title])[0];

        try {
            const response = await $fetch<TitleServer>("/api/titles", {
                method: "POST",
                body: mappedTitle,
            });
            return mapToClient([response])[0];
        } catch (e) {
            const error = e as FetchError;
            console.error(
                `Ошибка при запросе на сервер: ${error.message}
                Статус-код: ${error.statusCode}`
            );
        }
    }

    async function deleteTitle(titleId: string) {
        try {
            await $fetch<TitleServer>("/api/titles", {
                method: "DELETE",
                body: { uuid: titleId },
            });
        } catch (e) {
            const error = e as FetchError;
            console.error(`Ошибка при запросе на сервер: ${error.message}`);
        }
    }

    async function updateTitle(title: Title | TitlePartial) {
        const mappedTitle = mapToServerPartial([title])[0];

        try {
            const response = await $fetch<TitleServer>("/api/titles", {
                method: "PUT",
                body: mappedTitle,
            });

            const mappedResponse = mapToClient([response])[0];

            const foundIndex = titles.value.findIndex(
                (item) => item.uuid === mappedResponse?.uuid
            );

            if (mappedResponse && foundIndex > -1) {
                titles.value[foundIndex] = mappedResponse;
            }
        } catch (e) {
            const error = e as FetchError;
            console.error(
                `Ошибка при запросе на сервер: ${error.message}
                Статус-код: ${error.statusCode}`
            );
        }
    }

    async function addTag(title: Title, tag: TagPartial) {
        const tags = [...title.tags, tag];
        const reqTitle = { ...title, tags };
        return updateTitle(reqTitle);
    }

    async function removeTag(title: Title, tag: Tag) {
        const tags = title.tags.filter((item) => item.uuid !== tag.uuid);
        const reqTitle = { ...title, tags };
        return updateTitle(reqTitle);
    }

    return {
        titles: computed(() => titles.value),
        pages: computed(() => pages.value),
        isLoadingPages: computed(() => isLoadingPages.value),
        isLoadingTitles: computed(() => isLoadingTitles.value),
        addTitle,
        deleteTitle,
        fetchTitles,
        fetchPagesAmount,
        updateTitle,
        addTag,
        removeTag,
    };
});
