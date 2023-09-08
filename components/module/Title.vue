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
    const isRemoveTitleMenuOpen = ref(false);

    function action<T extends () => Promise<any>>(awaited: T): ReturnType<T> {
        loading.value = true;

        return awaited().then((res) => {
            loading.value = false;
            return res;
        }) as ReturnType<T>;
    }

    async function onNameChange(name: string) {
        action(() => titlesStore.changeTitleName(props.title.id, name));
    }
    async function onDescriptionChange(description: string) {
        action(() =>
            titlesStore.changeTitleDescription(props.title.id, description)
        );
    }
    async function onRatingChange(rating: number) {
        action(() => {
            rating = typeof rating === "string" ? parseInt(rating) : rating;
            return titlesStore.rateTitle(props.title.id, rating);
        });
    }
    async function onStatusChange(status: TitleStatus) {
        action(() => titlesStore.changeTitleStatus(props.title.id, status));
    }
    async function onAddTag(tag: Tag) {
        action(() => titlesStore.addTag(props.title.id, tag));
    }
    async function onRemoveTag(tag: Tag) {
        if (!("id" in tag) || !tag.id) {
            throw new Error("Tag must have an id");
        }
        action(() => titlesStore.removeTag(props.title.id, tag));
    }
    async function onPosterChange(poster: TitlePoster) {
        action(() => titlesStore.changeTitlePoster(props.title.id, poster));
    }
    async function onRemoveTitle() {
        action(() => titlesStore.removeTitle(props.title.id));
    }
</script>
