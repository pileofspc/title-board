<template>
    <VCard class="card" rounded="lg" :loading="loading">
        <VCardItem>
            <div class="title-item__poster-container">
                <TitlePoster
                    :poster="props.title.poster"
                    :disabled="loading"
                    @edit-poster="onEditPoster"
                    class="title-item__poster"
                />
            </div>
            <div class="title-item__data">
                <TagGroup
                    :tags="props.title.tags"
                    :max-tags="5"
                    :disabled="loading"
                    @add-tag="onAddTag"
                    @remove-tag="onRemoveTag"
                />

                <div class="mt-3">
                    <TitleName
                        :text="props.title.name"
                        :disabled="loading"
                        v-model:editing="isEditingName"
                        @name-change="onTitleNameChange"
                        variant="title"
                    />
                    <TitleName
                        :text="props.title.description"
                        :disabled="loading"
                        v-model:editing="isEditingDescription"
                        @name-change="onTitleDescriptionChange"
                        variant="subtitle"
                    />
                </div>

                <div class="mt-3">
                    <VMenu location="bottom start" offset="8">
                        <template #activator="{ props: slotProps }">
                            <VChip
                                v-bind="slotProps"
                                :disabled="loading"
                                :color="statuses[props.title.status].color"
                            >
                                {{ statuses[props.title.status].display }}
                            </VChip>
                        </template>

                        <FormChangeStatus @selected="onStatusSelected" />
                    </VMenu>
                </div>

                <VRating
                    :disabled="loading"
                    v-model="props.title.rating"
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
    const props = defineProps<{
        title: Title;
        loading?: boolean;
    }>();
    const emit = defineEmits<{
        "update:loading": [value: boolean];
        addTag: [titleId: string, tag: Tag];
        removeTag: [titleId: string, tag: Tag];
        removeTitle: [titleId: string];
        ratingChange: [titleId: string, rating: number];
        statusChange: [titleId: string, status: TitleStatus];
        nameChange: [titleId: string, name: string];
        descriptionChange: [titleId: string, description: string];
        posterChange: [titleId: string, poster: TitlePoster];
    }>();

    const statuses = useStatuses();

    const isRemoveTitleMenuOpen = ref(false);
    const isEditingName = ref(false);
    const isEditingDescription = ref(false);
    const loading = ref(false);

    function onAddTag(tag: Tag) {
        emit("addTag", props.title.id, tag);
    }
    function onRemoveTag(tag: Tag) {
        emit("removeTag", props.title.id, tag);
    }
    function onRemoveTitle() {
        emit("removeTitle", props.title.id);
        isRemoveTitleMenuOpen.value = false;
    }
    function onRatingChange(rating: string | number) {
        rating = typeof rating === "string" ? parseInt(rating) : rating;
        emit("ratingChange", props.title.id, rating);
    }
    function onStatusSelected(status: TitleStatus) {
        emit("statusChange", props.title.id, status);
    }
    function onTitleNameChange(name: string) {
        emit("nameChange", props.title.id, name);
        // TODO: then isEditingName.value = false
    }
    function onTitleDescriptionChange(description: string) {
        emit("descriptionChange", props.title.id, description);
        // TODO: then isEditingDescription.value = false
    }
    function onEditPoster(poster: TitlePoster) {
        emit("posterChange", props.title.id, poster);
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
