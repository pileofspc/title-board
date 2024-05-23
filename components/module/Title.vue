<template>
    <TitleCard
        :title="props.title"
        :loading="loading"
        @name-change="onNameChange"
        @description-change="onDescriptionChange"
        @rating-change="onRatingChange"
        @status-change="onStatusChange"
        @add-tag="onAddTag"
        @remove-tag="onRemoveTag"
        @poster-change="onPosterChange"
        @remove-title="onRemoveTitle"
    >
    </TitleCard>
</template>

<script setup lang="ts">
    const props = defineProps<{
        title: Title;
    }>();

    function isFullTag(tag: TagPartial | Tag): tag is Tag {
        return (
            typeof tag.title_uuid === "string" && typeof tag.uuid === "string"
        );
    }

    const titlesStore = useTitlesStore();
    const loading = ref(false);

    const onNameChange = decorateWithLoadingManagement(
        async function onNameChange(name: string) {
            const reqTitle = { ...props.title, name };
            return titlesStore.updateTitle(reqTitle);
        },
        loading
    );
    const onDescriptionChange = decorateWithLoadingManagement(
        async function onDescriptionChange(description: string) {
            const reqTitle = { ...props.title, description };
            return titlesStore.updateTitle(reqTitle);
        },
        loading
    );
    const onRatingChange = decorateWithLoadingManagement(
        async function onRatingChange(rating: number) {
            const reqTitle = { ...props.title, rating };
            return titlesStore.updateTitle(reqTitle);
        },
        loading
    );
    const onStatusChange = decorateWithLoadingManagement(
        async function onStatusChange(status: TitleStatus) {
            const reqTitle = { ...props.title, status };
            return titlesStore.updateTitle(reqTitle);
        },
        loading
    );
    const onAddTag = decorateWithLoadingManagement(async function onAddTag(
        tag: TagPartial
    ) {
        return titlesStore.addTag(props.title, tag);
    }, loading);
    const onRemoveTag = decorateWithLoadingManagement(
        async function onRemoveTag(tag: TagPartial) {
            if (isFullTag(tag)) {
                return titlesStore.removeTag(props.title, tag);
            } else {
                console.error(
                    "Ошибка при удалении тега: отсутствует uuid или title_uuid"
                );
            }
        },
        loading
    );
    const onPosterChange = decorateWithLoadingManagement(
        async function onPosterChange(poster: TitlePoster) {
            const reqTitle = { ...props.title, poster };
            return titlesStore.updateTitle(reqTitle);
        },
        loading
    );
    const onRemoveTitle = decorateWithLoadingManagement(
        async function onRemoveTitle() {
            await titlesStore.deleteTitle(props.title.uuid);
        },
        loading
    );
</script>
