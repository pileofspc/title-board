<template>
    <VCard v-if="loading" loading rounded="lg" min-height="230" class="card" />
    <template v-else>
        <TransitionGroup @before-leave="beforeLeave">
            <div v-if="titlesStore.titles.length === 0" key="nothing">
                Пока ничего нет :(
            </div>

            <div class="list-titles__new-title rounded-lg pa-4" key="new-title">
                <TitleItem
                    v-if="isAddingTitle"
                    :title="newTitle"
                    :key="newTitle.id"
                />
            </div>

            <TitleItem
                v-for="title in titlesStore.titles"
                :title="title"
                :key="title.id"
                class="mt-4"
                @add-tag="(titleId, tag) => titlesStore.addTag(titleId, tag)"
                @remove-tag="
                    (titleId, tag) => titlesStore.removeTag(titleId, tag)
                "
                @name-change="
                    (titleId, name) =>
                        titlesStore.changeTitleName(titleId, name)
                "
                @description-change="
                    (titleId, description) =>
                        titlesStore.changeTitleDescription(titleId, description)
                "
                @rating-change="
                    (titleId, rating) => titlesStore.rateTitle(titleId, rating)
                "
                @status-change="
                    (titleId, status) =>
                        titlesStore.changeTitleStatus(titleId, status)
                "
                @poster-change="
                    (titleId, poster) =>
                        titlesStore.changeTitlePoster(titleId, poster)
                "
                @remove-title="(titleId) => titlesStore.removeTitle(titleId)"
            />
        </TransitionGroup>
    </template>
</template>

<script setup lang="ts">
    import { v4 } from "uuid";

    const titlesStore = useTitlesStore();
    const statuses = useStatuses();

    const isAddingTitle = ref(true);
    const newTitle: Title = {
        id: v4(),
        name: "Новый тайтл",
        description: "Новое описание",
        rating: 0,
        status: statuses.value.NOT_WATCHED.name,
        tags: [],
    };

    const loading = ref(true);
    titlesStore.fetchTitles().then(() => {
        loading.value = false;
    });

    function beforeLeave(element: Element) {
        const el = element as HTMLElement;
        const rect = getCoords(el);
        el.style.width = `${rect.width}px`;
    }
    // FIXME: При удалении тайтла почему-то происходит анимация тегов
</script>

<style scoped lang="scss">
    .list-titles {
        &__new-title {
            border-width: 2px;
            border-style: dotted;
            border-color: gray;
        }
    }

    .v-move,
    .v-enter-active,
    .v-leave-active {
        transition: all 0.6s ease;
    }
    .v-enter-from,
    .v-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }

    .v-leave-active {
        position: absolute;
    }
</style>
