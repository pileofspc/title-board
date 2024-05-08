export const useGlobalStore = defineStore("global", () => {
    const isAddingTitle = ref(false);

    return {
        isAddingTitle,
    };
});
