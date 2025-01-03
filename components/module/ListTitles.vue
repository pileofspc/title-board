<template>
    <div class="title-list mt-4">
        <TransitionGroup name="placeholder" @before-leave="beforeLeave">
            <ModuleTitlePlaceholder
                v-if="isAddingTitle"
                key="first"
                class="placeholder"
            />
            <div v-else key="third"></div>
            <div class="title-list__main" key="second">
                <VCard
                    v-if="isLoadingTitles"
                    loading
                    rounded="lg"
                    min-height="230"
                    class="card"
                />

                <template v-else>
                    <div class="title-list__list">
                        <TransitionGroup
                            name="list"
                            @before-leave="beforeLeave"
                        >
                            <ModuleTitle
                                v-for="title in titles"
                                :title="title"
                                :key="title.uuid"
                                class="title-list__title"
                            />
                        </TransitionGroup>
                    </div>

                    <Transition>
                        <div v-show="titles.length === 0" key="nothing">
                            Пока ничего нет :(
                        </div>
                    </Transition>
                </template>
            </div>
        </TransitionGroup>
        <VPagination
            v-if="pages > 1"
            :disabled="isLoadingPages"
            :length="pages"
            color="blue-grey"
            v-model="currentPage"
        />
    </div>
</template>

<script setup lang="ts">
    const titlesStore = useTitlesStore();
    const globalStore = useGlobalStore();
    const { titles, pages, isLoadingTitles, isLoadingPages } =
        storeToRefs(titlesStore);
    const { isAddingTitle } = storeToRefs(globalStore);

    const currentPage = Number(useRoute().query.page);

    // TODO: Возможно будут проблемы с top level await'ом
    // сервер не ждет пока выполнится моя функция refetch без top level await'а
    // Пробовал onServerPrefetch - выскакивает непонятная ошибка гидратации.
    // Еще есть вариант в сетап функции стора сразу использовать useFetch, а дальше уже $fetch на клиенте
    // Можно сделать просто useFetch здесь, но не хочется отказываться от удобной абстракции стора titles.ts
    // Хотелось бы чтобы все манипуляции происходили именно в этой абстракции (необязательно в сторе, но чтобы все было в одном месте)
    // watch(currentPage, refetch);
    // async function refetch() {
    //     isLoading.value = true;
    //     await titlesStore.fetchTitles(currentPage.value);

    //     if (titlesStore.titles.length === 0 && currentPage.value > 0) {
    //         currentPage.value--;
    //     }
    //     isLoading.value = false;
    // }

    // FIXME: При удалении тайтла почему-то происходит анимация тегов
    function beforeLeave(element: Element) {
        const el = element as HTMLElement;
        const rect = getCoords(el);
        el.style.width = `${rect.width}px`;
    }
</script>

<style scoped lang="scss">
    .title-list {
        position: relative;

        &__list {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-top: 16px;
        }
    }

    .placeholder-move,
    .placeholder-enter-active,
    .placeholder-leave-active {
        transition:
            transform 0.4s ease,
            opacity 0.4s;

        .list-move,
        .list-enter-active,
        .list-leave-active {
            transition: none;
        }
    }
    .placeholder-enter-from,
    .placeholder-leave-to {
        opacity: 0;
        transform: scaleY(0);
    }
    .placeholder-leave-active {
        position: absolute;
    }
    .placeholder {
        transform-origin: center top;
        overflow: hidden;
    }

    .list-move,
    .list-enter-active,
    .list-leave-active {
        transition:
            transform 0.6s,
            opacity 0.6s;
    }
    .list-enter-from,
    .list-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }
    .list-leave-active {
        position: absolute;
    }
</style>
