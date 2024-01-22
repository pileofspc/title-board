<template>
    <div class="title-list mt-4">
        <TransitionGroup name="placeholder" @before-leave="beforeLeave">
            <ModuleTitlePlaceholder
                v-if="globalStore.isAddingTitle"
                key="first"
                class="placeholder"
                @done="performFetch"
            />
            <div v-else key="third"></div>

            <div class="title-list__main" key="second">
                <VCard
                    v-if="isLoading"
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
                                @done="performFetch"
                                class="title-list__title"
                            />
                        </TransitionGroup>
                    </div>

                    <Transition>
                        <div v-if="titles.length === 0" key="nothing">
                            Пока ничего нет :(
                        </div>
                    </Transition>
                </template>
            </div>
        </TransitionGroup>
        <VPagination
            v-if="titlesStore.pages > 1"
            :disabled="isLoading"
            :length="titlesStore.pages"
            color="blue-grey"
            v-model="currentPage"
        />
    </div>
</template>

<script setup lang="ts">
    const titlesStore = useTitlesStore();
    const globalStore = useGlobalStore();

    const titles = computed(() => titlesStore.titles);
    const isLoading = ref(false);
    const currentPage = ref(1);

    async function performFetch() {
        isLoading.value = true;
        titlesStore.fetchPagesAmount();
        await titlesStore.fetchTitles(
            currentPage.value - 1 >= 0 ? currentPage.value - 1 : 0
        );

        if (titles.value.length === 0 && currentPage.value > 0) {
            currentPage.value--;
        }
        isLoading.value = false;
    }

    watch(currentPage, performFetch, {
        immediate: true,
    });

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
        transition: transform 0.4s ease, opacity 0.4s;

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
        transition: transform 0.6s, opacity 0.6s;
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
