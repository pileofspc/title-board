<template>
    <div class="title-placeholder rounded-lg pa-4">
        <TitleCard
            :title="title"
            :loading="loading"
            is-placeholder
            @name-change="onNameChange"
            @description-change="onDescriptionChange"
            @rating-change="onRatingChange"
            @status-change="onStatusChange"
            @add-tag="onAddTag"
            @remove-tag="onRemoveTag"
            @poster-change="onPosterChange"
            @confirm="onConfirm"
            @cancel="onCancel"
        />
    </div>
</template>

<script setup lang="ts">
    import { v4 } from "uuid";
    import { titleStatuses } from "~/constants";

    const titlesStore = useTitlesStore();
    const globalStore = useGlobalStore();

    const title = ref<Title>({
        id: v4(),
        name: "Новый тайтл",
        description: "Новое описание",
        rating: 0,
        status: titleStatuses.NOT_WATCHED,
        tags: [],
    });
    const loading = ref(false);
    // function action<T extends () => Promise<any>>(awaited: T): ReturnType<T> {
    //     loading.value = true;

    //     return awaited().then((res) => {
    //         loading.value = false;
    //         return res;
    //     }) as ReturnType<T>;
    // }

    function onNameChange(name: string) {
        title.value.name = name;
    }
    function onDescriptionChange(description: string) {
        title.value.description = description;
    }
    function onRatingChange(rating: number) {
        rating = typeof rating === "string" ? parseInt(rating) : rating;
        title.value.rating = rating;
    }
    function onStatusChange(status: TitleStatus) {
        title.value.status = status;
    }
    function onAddTag(tag: Tag) {
        title.value.tags.push(tag);
    }
    function onRemoveTag(tag: Tag) {
        title.value.tags = title.value.tags.filter(
            (titleTag) => titleTag !== tag
        );
    }
    function onPosterChange(poster: TitlePoster) {
        title.value.poster = poster;
    }
    async function onConfirm(title: Title) {
        loading.value = true;
        await titlesStore.addTitle(title);
        loading.value = false;
        onCancel();
    }
    function onCancel() {
        globalStore.isAddingTitle = false;
    }
</script>

<style scoped lang="scss">
    .title-placeholder {
        border-width: 2px;
        border-style: dotted;
        border-color: gray;
    }
</style>
