<template>
    <VCard class="card" rounded="lg" :loading="loading">
        <VCardItem>
            <div class="title-item__poster-container">
                <TitlePoster
                    :poster="title.poster"
                    :disabled="loading"
                    @edit-poster="onEditPoster"
                    class="title-item__poster"
                />
            </div>
            <div class="title-item__data">
                <TagGroup
                    :tags="title.tags"
                    :max-tags="5"
                    :disabled="loading"
                    @add-tag="onAddTag"
                    @remove-tag="onRemoveTag"
                />

                <div class="mt-3">
                    <TitleName
                        :text="title.name"
                        :disabled="loading"
                        v-model:editing="isEditingName"
                        @name-change="onNameChange"
                        variant="title"
                    />
                    <TitleName
                        :text="title.description"
                        :disabled="loading"
                        v-model:editing="isEditingDescription"
                        @name-change="onDescriptionChange"
                        variant="subtitle"
                    />
                </div>

                <div class="mt-3">
                    <VMenu location="bottom start" offset="8">
                        <template #activator="{ props: slotProps }">
                            <VChip
                                v-bind="slotProps"
                                :disabled="loading"
                                :color="statuses[title.status].color"
                            >
                                {{ statuses[title.status].display }}
                            </VChip>
                        </template>

                        <FormChangeStatus @selected="onStatusChange" />
                    </VMenu>
                </div>

                <VRating
                    :disabled="loading"
                    v-model="title.rating"
                    @update:model-value="onRatingChange"
                    hover
                    half-increments
                    size="30"
                    active-color="yellow-darken-3"
                    color="blue-grey"
                    class="mt-3"
                />

                <div class="title-item__controls">
                    <VMenu
                        location="top right"
                        offset="8"
                        :close-on-content-click="false"
                        v-model="isRemoveTitleMenuOpen"
                    >
                        <template #activator="{ props: slotProps }">
                            <VBtn
                                v-bind="slotProps"
                                icon="mdi-delete"
                                size="small"
                                variant="tonal"
                                color="blue-grey"
                                class="ml-2"
                            />
                        </template>

                        <FormConfirm
                            :disabled="loading"
                            @confirm="onRemoveTitle"
                            @close="isRemoveTitleMenuOpen = false"
                        />
                    </VMenu>
                </div>
            </div>
        </VCardItem>
    </VCard>
</template>

<script setup lang="ts">
    import { statuses } from "~/constants";

    // const emit = defineEmits<{
    //     addTag: [titleId: string, tag: Tag];
    //     removeTag: [titleId: string, tag: Tag];
    //     removeTitle: [titleId: string];
    //     ratingChange: [titleId: string, rating: number];
    //     statusChange: [titleId: string, status: TitleStatus];
    //     nameChange: [titleId: string, name: string];
    //     descriptionChange: [titleId: string, description: string];
    //     posterChange: [titleId: string, poster: TitlePoster];
    // }>();
    const props = defineProps<{
        title: Title;
    }>();

    // const title = ref(structuredClone(props.title));
    const titlesStore = useTitlesStore();

    const isRemoveTitleMenuOpen = ref(false);
    const isEditingName = ref(false);
    const isEditingDescription = ref(false);
    const loading = ref(false);

    // function onAddTag(tag: Tag) {
    //     emit("addTag", title.value.id, tag);
    // }
    // function onRemoveTag(tag: Tag) {
    //     emit("removeTag", title.value.id, tag);
    // }
    // function onRemoveTitle() {
    //     emit("removeTitle", title.value.id);
    //     isRemoveTitleMenuOpen.value = false;
    // }
    // function onRatingChange(rating: string | number) {
    //     rating = typeof rating === "string" ? parseInt(rating) : rating;
    //     emit("ratingChange", title.value.id, rating);
    // }
    // function onStatusSelected(status: TitleStatus) {
    //     emit("statusChange", title.value.id, status);
    // }
    // function onTitleNameChange(name: string) {
    //     emit("nameChange", title.value.id, name);
    //     // TODO: then isEditingName.value = false
    // }
    // function onTitleDescriptionChange(description: string) {
    //     emit("descriptionChange", title.value.id, description);
    //     // TODO: then isEditingDescription.value = false
    // }
    // function onEditPoster(poster: TitlePoster) {
    //     emit("posterChange", title.value.id, poster);
    // }

    // async function action<T extends (...args: any[]) => Promise<any>>(
    //     awaited: T,
    //     ...args: Parameters<T>
    // ): Promise<ReturnType<T>> {
    //     loading.value = true;
    //     const result = await awaited(...args);
    //     loading.value = false;
    //     return result;
    // }

    function action<T extends () => Promise<any>>(awaited: T): ReturnType<T> {
        loading.value = true;

        return awaited().then((res) => {
            loading.value = false;
            return res;
        }) as ReturnType<T>;
    }

    async function onNameChange(name: string) {
        await action(() => titlesStore.changeTitleName(props.title.id, name));
        isEditingName.value = false;
    }
    async function onDescriptionChange(description: string) {
        await action(() =>
            titlesStore.changeTitleDescription(props.title.id, description)
        );
        isEditingDescription.value = false;
    }
    async function onRatingChange(rating: string | number) {
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
        action(() => titlesStore.removeTag(props.title.id, tag));
    }
    async function onEditPoster(poster: TitlePoster) {
        action(() => titlesStore.changeTitlePoster(props.title.id, poster));
    }
    async function onRemoveTitle() {
        action(() => titlesStore.removeTitle(props.title.id));
        isRemoveTitleMenuOpen.value = false;
    }
</script>

<style scoped lang="scss">
    .title-item {
        &__poster-container {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 50%;
        }

        &__poster {
            width: 100%;
            height: 100%;
        }

        &__data {
            position: relative;
            max-width: 50%;
        }

        &__controls {
            display: flex;
            position: absolute;
            right: 0;
            bottom: 0;
        }
    }

    @media (max-width: 850px) {
        .title-item {
            &__poster-container {
                position: static;
                margin-bottom: 12px;
            }
            &__data {
                max-width: none;
            }
        }
    }
</style>
