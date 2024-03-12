<template>
    <VCard class="card" rounded="lg" :loading="props.loading">
        <VCardItem>
            <div class="title-item__poster-container">
                <TitlePoster
                    :poster="props.title.poster"
                    :disabled="props.loading"
                    @edit-poster="onEditPosterClick"
                    class="title-item__poster"
                />
            </div>
            <div class="title-item__data">
                <TagGroup
                    :tags="props.title.tags"
                    :max-tags="5"
                    :disabled="props.loading"
                    @add-tag="onAddTagClick"
                    @remove-tag="onRemoveTagClick"
                />

                <div class="mt-3">
                    <TitleName
                        :text="props.title.name"
                        :disabled="props.loading"
                        v-model:editing="isEditingName"
                        @name-change="onNameChangeClick"
                        variant="title"
                    />
                    <TitleName
                        :text="props.title.description"
                        :disabled="props.loading"
                        v-model:editing="isEditingDescription"
                        @name-change="onDescriptionChangeClick"
                        variant="subtitle"
                    />
                </div>

                <div class="mt-3">
                    <VMenu location="bottom start" offset="8">
                        <template #activator="{ props: slotProps }">
                            <VChip
                                v-bind="slotProps"
                                :disabled="props.loading"
                                :color="statuses[props.title.status].color"
                            >
                                {{ statuses[props.title.status].display }}
                            </VChip>
                        </template>

                        <FormChangeStatus @selected="onStatusChange" />
                    </VMenu>
                </div>

                <VRating
                    :disabled="props.loading"
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
                    <template v-if="props.isPlaceholder">
                        <VBtn
                            @click="onConfirmClick"
                            icon="mdi-check"
                            size="small"
                            variant="tonal"
                            color="blue-grey"
                        />
                        <VBtn
                            @click="onCancelClick"
                            icon="mdi-cancel"
                            size="small"
                            variant="tonal"
                            color="blue-grey"
                        />
                    </template>
                    <template v-else>
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
                                />
                            </template>

                            <FormConfirm
                                :disabled="loading"
                                @confirm="onRemoveTitleClick"
                                @cancel="isRemoveTitleMenuOpen = false"
                            />
                        </VMenu>
                    </template>
                </div>
            </div>
        </VCardItem>
    </VCard>
</template>

<script setup lang="ts">
    import { statuses } from "~/constants";

    const props = defineProps<{
        title: TitlePartial;
        loading?: boolean;
        isPlaceholder?: boolean;
    }>();
    const emit = defineEmits<{
        nameChange: [name: string];
        descriptionChange: [description: string];
        ratingChange: [rating: number];
        statusChange: [status: TitleStatus];
        addTag: [tag: Tag];
        removeTag: [tag: Tag];
        posterChange: [poster: TitlePoster];
        removeTitle: [title: TitlePartial];
        confirm: [title: TitlePartial];
        cancel: [title: TitlePartial];
    }>();

    const isEditingName = ref(false);
    const isEditingDescription = ref(false);
    const isRemoveTitleMenuOpen = ref(false);

    function onNameChangeClick(name: string) {
        emit("nameChange", name);
        isEditingName.value = false;
    }
    function onDescriptionChangeClick(description: string) {
        emit("descriptionChange", description);
        isEditingDescription.value = false;
    }
    function onRatingChange(rating: string | number) {
        rating = typeof rating === "string" ? parseInt(rating) : rating;
        emit("ratingChange", rating);
    }
    function onStatusChange(status: TitleStatus) {
        emit("statusChange", status);
    }
    function onAddTagClick(tag: Tag) {
        emit("addTag", tag);
    }
    function onRemoveTagClick(tag: Tag) {
        emit("removeTag", tag);
    }
    function onEditPosterClick(poster: TitlePoster) {
        emit("posterChange", poster);
    }
    function onRemoveTitleClick() {
        emit("removeTitle", props.title);
    }
    function onConfirmClick() {
        emit("confirm", props.title);
    }
    function onCancelClick() {
        emit("cancel", props.title);
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
            gap: 8px;
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
