import { apiEndpoints } from "~/constants";
import { isDefined } from "~/utils/helpers";

export const useTitlesStore = defineStore("titles", () => {
    const titles = ref<Title[]>([]);
    const pages = ref(0);
    const titlesComputed = computed(() => titles.value);
    const pagesComputed = computed(() => pages.value);

    // function updateExistingTitle(res: ApiResponse<Title>) {
    //     if (!res.success) {
    //         return res;
    //     }
    //     titlesState.value[
    //         titlesState.value.findIndex((item) => item.id === res.data.id)
    //     ] = res.data;
    //     return res;
    // }

    // TODO: Привести Title и TitleServer к единому виду или хотя бы прилично переделать эту функцию с правильной типизацией
    function mapTitles(titles: TitleServer[]): Title[] {
        return titles.map((item) => {
            return {
                id: item.id,
                name: item.name,
                description: item.description,
                status: item.status,
                rating: item.rating,
                poster: {
                    img: item.img,
                    link: item.link,
                    position: {
                        x: item.pos_x || 50,
                        y: item.pos_y || 50,
                    },
                },
                tags: [],
            };
        });
    }

    async function fetchPagesAmount() {
        const url = new URL(apiEndpoints.titles);
        url.searchParams.append("total", "true");

        const response = await useFetch<number>(url.toString());
        if (response.error.value || !response.data.value) {
            console.warn(
                `Ошибка при запросе на сервер: ${response.error.value?.message}`
            );
            return 0;
        }

        pages.value = response.data.value;
    }

    async function fetchTitles(page?: number) {
        const url = new URL(apiEndpoints.titles);
        url.searchParams.append("perpage", "10");
        url.searchParams.append(
            "page",
            typeof page === "number" ? `${page}` : "0"
        );

        const response = await useFetch<TitleServer[]>(url.toString());
        if (response.error.value || !response.data.value) {
            console.warn(
                `Ошибка при запросе на сервер: ${response.error.value?.message}`
            );
            return [];
        }

        // await fetchPagesAmount();
        titles.value = mapTitles(response.data.value);
    }

    async function addTitle(title: Title) {
        const response = await useFetch<TitleServer[]>("/api/titles", {
            method: "POST",
            body: title,
        });
        if (response.error) {
            return;
        }

        if (isDefined(response.data.value)) {
            titles.value = mapTitles(response.data.value);
        }
        return response.data.value;
    }

    async function removeTitle(titleId: string) {
        const response = await useFetch("/api/title", {
            method: "DELETE",
            body: {
                id: titleId,
            },
        });
        if (response.data.value !== null) {
            titles.value = response.data.value;
        }
        return response.data.value;
    }

    async function rateTitle(titleId: string, rating: number) {
        // return new Promise<ApiResponse<Title>>((resolve) => {
        //     setTimeout(() => {
        //         const title = findTitle(titleId);
        //         if (title) {
        //             title.rating = rating;
        //             resolve({
        //                 success: true,
        //                 data: deepCopy(title),
        //             });
        //         } else {
        //             resolve({
        //                 success: false,
        //             });
        //         }
        //     }, 2000);
        // }).then(updateExistingTitle);
    }

    async function addTag(titleId: string, tag: Tag) {
        // return new Promise<ApiResponse<Title>>((resolve) => {
        //     setTimeout(() => {
        //         // тут присвоение типа и uuid временно пока нет фетчинга
        //         tag.id = uuidv4();
        //         const title = findTitle(titleId);
        //         if (title) {
        //             title.tags.push(tag);
        //             resolve({
        //                 success: true,
        //                 data: deepCopy(title),
        //             });
        //         } else {
        //             resolve({
        //                 success: false,
        //             });
        //         }
        //     }, 3000);
        // }).then(updateExistingTitle);
    }

    async function removeTag(titleId: string, tag: Tag) {
        // return new Promise<ApiResponse<Title>>((resolve) => {
        //     setTimeout(() => {
        //         const title = findTitle(titleId);
        //         if (title) {
        //             title.tags = title.tags.filter(
        //                 (item) => item.id !== tag.id
        //             );
        //             resolve({
        //                 success: true,
        //                 data: deepCopy(title),
        //             });
        //         } else {
        //             resolve({
        //                 success: false,
        //             });
        //         }
        //     }, 300);
        // }).then(updateExistingTitle);
    }

    async function changeTitleStatus(titleId: string, status: TitleStatus) {
        // return new Promise<ApiResponse<Title>>((resolve) => {
        //     setTimeout(() => {
        //         const title = findTitle(titleId);
        //         if (title) {
        //             title.status = status;
        //             resolve({
        //                 success: true,
        //                 data: deepCopy(title),
        //             });
        //         } else {
        //             resolve({
        //                 success: false,
        //             });
        //         }
        //     }, 3000);
        // }).then(updateExistingTitle);
    }

    async function changeTitleName(titleId: string, name: string) {
        // return new Promise<ApiResponse<Title>>((resolve) => {
        //     setTimeout(() => {
        //         const title = findTitle(titleId);
        //         if (title) {
        //             title.name = name;
        //             resolve({
        //                 success: true,
        //                 data: deepCopy(title),
        //             });
        //         } else {
        //             resolve({
        //                 success: false,
        //             });
        //         }
        //     }, 2000);
        // }).then(updateExistingTitle);
    }

    async function changeTitleDescription(
        titleId: string,
        description: string
    ) {
        // return new Promise<ApiResponse<Title>>((resolve) => {
        //     setTimeout(() => {
        //         const title = findTitle(titleId);
        //         if (title) {
        //             title.description = description;
        //             resolve({
        //                 success: true,
        //                 data: deepCopy(title),
        //             });
        //         } else {
        //             resolve({
        //                 success: false,
        //             });
        //         }
        //     }, 2000);
        // }).then(updateExistingTitle);
    }

    async function changeTitlePoster(titleId: string, poster: TitlePoster) {
        // const title = findTitle(titleId);
        // if (title && "imgFileBase64" in poster && poster.imgFileBase64) {
        //     if (title?.poster?.img) {
        //         URL.revokeObjectURL(title.poster.img);
        //     }
        //     const blob = await fetch(poster.imgFileBase64).then((res) =>
        //         res.blob()
        //     );
        //     poster.img = URL.createObjectURL(blob);
        //     delete poster.imgFileBase64;
        //     return new Promise<ApiResponse<Title>>((resolve) => {
        //         setTimeout(() => {
        //             title.poster = poster;
        //             resolve({
        //                 success: true,
        //                 data: deepCopy(title),
        //             });
        //         }, 2000);
        //     }).then(updateExistingTitle);
        // }
        // if (title) {
        //     return new Promise<ApiResponse<Title>>((resolve) => {
        //         setTimeout(() => {
        //             title.poster = poster;
        //             resolve({
        //                 success: true,
        //                 data: deepCopy(title),
        //             });
        //         }, 2000);
        //     }).then(updateExistingTitle);
        // }
        // return new Promise<ApiResponse<Title>>((resolve) => {
        //     setTimeout(() => {
        //         resolve({
        //             success: false,
        //         });
        //     }, 2000);
        // });
    }

    return {
        titles: titlesComputed,
        pages: pagesComputed,
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
