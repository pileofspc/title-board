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

    const titlesStore = useTitlesStore();
    const loading = ref(false);

    async function action<T extends () => Promise<any>>(awaited: T) {
        loading.value = true;
        const result = await awaited();
        loading.value = false;
        return result as ReturnType<T>;
    }

    async function onNameChange(name: string) {
        handleLoadingAsync(async () => {
            const reqTitle = { ...props.title, name };
            return titlesStore.updateTitle(reqTitle);
        }, loading);
    }
    async function onDescriptionChange(description: string) {
        action(async () => {
            const reqTitle = { ...props.title, description };
            return titlesStore.updateTitle(reqTitle);
        });
    }
    async function onRatingChange(rating: number) {
        action(async () => {
            const reqTitle = { ...props.title, rating };
            return titlesStore.updateTitle(reqTitle);
        });
    }
    async function onStatusChange(status: TitleStatus) {
        action(async () => {
            const reqTitle = { ...props.title, status };
            return titlesStore.updateTitle(reqTitle);
        });
    }
    async function onAddTag(tag: Tag) {
        action(async () => {
            return titlesStore.addTag(props.title, tag);
        });
    }
    async function onRemoveTag(tag: Tag) {
        action(async () => {
            return titlesStore.removeTag(props.title, tag);
        });
    }
    async function onPosterChange(poster: TitlePoster) {
        action(async () => {
            const reqTitle = { ...props.title, poster };
            return titlesStore.updateTitle(reqTitle);
        });
    }
    async function onRemoveTitle() {
        action(async () => {
            await titlesStore.deleteTitle(props.title.uuid);
        });
    }
</script>
