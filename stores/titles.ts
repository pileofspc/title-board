export const useTitlesStore = defineStore("titles", () => {
    const titlesState = ref<Title[]>([]);
    const titles = computed(() => titlesState.value);

    // function updateExistingTitle(res: ApiResponse<Title>) {
    //     if (!res.success) {
    //         return res;
    //     }
    //     titlesState.value[
    //         titlesState.value.findIndex((item) => item.id === res.data.id)
    //     ] = res.data;
    //     return res;
    // }

    async function fetchTitles() {
        const response = await useFetch("/api/titles");
        if (response.data.value !== null) {
            titlesState.value = response.data.value;
        }
    }

    async function addTitle(title: Title) {
        const response = await useFetch("/api/titles", {
            method: "POST",
            body: title,
        });
        if (response.data.value !== null) {
            titlesState.value = response.data.value;
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
            titlesState.value = response.data.value;
        }
        return response.data.value;
    }

    function rateTitle(titleId: string, rating: number) {
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

    function addTag(titleId: string, tag: Tag) {
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

    function removeTag(titleId: string, tag: Tag) {
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

    function changeTitleStatus(titleId: string, status: TitleStatus) {
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

    function changeTitleName(titleId: string, name: string) {
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

    function changeTitleDescription(titleId: string, description: string) {
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
