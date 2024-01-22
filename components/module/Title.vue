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

    // TODO: этого эмита быть не должно: он нужен только потому,
    //  что непонятно какую конкретно страницу фетчить, т.к пока не понимаю,
    // как в наксте в сторе использовать одну функцию из другой (смотреть в ListTitles и titles.client.ts).
    const emit = defineEmits(["done"]);

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
        action(() => titlesStore.changeTitleName(props.title.uuid, name));
    }
    async function onDescriptionChange(description: string) {
        action(() =>
            titlesStore.changeTitleDescription(props.title.uuid, description)
        );
    }
    async function onRatingChange(rating: number) {
        action(() => {
            const intRating =
                typeof rating === "string" ? parseInt(rating) : rating;
            return titlesStore.rateTitle(props.title.uuid, intRating);
        });
    }
    async function onStatusChange(status: TitleStatus) {
        action(() => titlesStore.changeTitleStatus(props.title.uuid, status));
    }
    async function onAddTag(tag: Tag) {
        action(() => titlesStore.addTag(props.title.uuid, tag));
    }
    async function onRemoveTag(tag: Tag) {
        if (!("id" in tag) || !tag.id) {
            throw new Error("Tag must have an id");
        }
        action(() => titlesStore.removeTag(props.title.uuid, tag));
    }
    async function onPosterChange(poster: TitlePoster) {
        action(() => titlesStore.changeTitlePoster(props.title.uuid, poster));
    }
    async function onRemoveTitle() {
        return action(async () => {
            await titlesStore.deleteTitle(props.title.uuid);
            titlesStore.fetchPagesAmount();
            emit("done");
        });
    }
</script>
