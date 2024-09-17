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

    const onNameChange = withLoadingState(loading)(async function onNameChange(
        name: string
    ) {
        const reqTitle = { ...props.title, name };
        return titlesStore.updateTitle(reqTitle);
    });

    const onDescriptionChange = withLoadingState(loading)(
        async function onDescriptionChange(description: string) {
            const reqTitle = { ...props.title, description };
            return titlesStore.updateTitle(reqTitle);
        }
    );
    const onRatingChange = withLoadingState(loading)(
        async function onRatingChange(rating: number) {
            const reqTitle = { ...props.title, rating };
            return titlesStore.updateTitle(reqTitle);
        }
    );
    const onStatusChange = withLoadingState(loading)(
        async function onStatusChange(status: TitleStatus) {
            const reqTitle = { ...props.title, status };
            return titlesStore.updateTitle(reqTitle);
        }
    );
    const onAddTag = withLoadingState(loading)(async function onAddTag(
        tag: TagPartial
    ) {
        return titlesStore.addTag(props.title, tag);
    });
    const onRemoveTag = withLoadingState(loading)(async function onRemoveTag(
        tag: TagPartial
    ) {
        if (isFullTag(tag)) {
            return titlesStore.removeTag(props.title, tag);
        } else {
            console.error(
                "Ошибка при удалении тега: отсутствует uuid или title_uuid"
            );
        }
    });
    const onPosterChange = withLoadingState(loading)(
        async function onPosterChange(poster: TitlePoster) {
            const reqTitle = { ...props.title, poster };
            return titlesStore.updateTitle(reqTitle);
        }
    );
    const onRemoveTitle = withLoadingState(loading)(
        async function onRemoveTitle() {
            await titlesStore.deleteTitle(props.title.uuid);
        }
    );
</script>
