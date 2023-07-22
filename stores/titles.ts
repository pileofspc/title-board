export const useTitlesStore = defineStore("titles", () => {
    const titlesState: Ref<Title[]> = ref([]);
    let mockJson: Title[] = [
        {
            id: "1",
            rating: 0,
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

    // function getTitle(titleId: string) {
    //     const foundTitle = findTitle(titleId);

    //     if (foundTitle) {
    //         return computed(() => foundTitle);
    //     }
    // }

    async function removeTitle(titleId: string) {
        return new Promise((resolve) => {
            setTimeout(() => {
                mockJson = mockJson.filter((title) => title.id !== titleId);
                titlesState.value = mockJson;
                resolve(null);
            }, 2000);
        });
    }

    async function rateTitle(titleId: string, rating: number) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const foundTitle = findTitle(titleId);
                if (foundTitle) {
                    foundTitle.rating = rating;
                }

                titlesState.value = mockJson;
                resolve(null);
            }, 2000);
        });
    }

    async function fetchTitles() {
        return new Promise((resolve) => {
            setTimeout(() => {
                titlesState.value = mockJson;
                resolve(null);
            }, 2000);
        });
    }

    async function removeTag(titleId: string, tag: Tag) {
        const foundTitle = findTitle(titleId);

        if (foundTitle) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    foundTitle.tags = foundTitle.tags.filter(
                        (item) => item.id !== tag.id
                    );
                    resolve(null);
                }, 3000);
            });
        }
    }

    async function addTag(titleId: string, tag: Tag) {
        const foundTitle = findTitle(titleId);

        if (foundTitle) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    foundTitle.tags.push(tag);
                    resolve(null);
                }, 3000);
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
    };
});
