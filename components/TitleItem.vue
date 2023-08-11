<template>
    <VCard class="card" rounded="lg" :loading="loading">
        <VCardItem>
            <div class="title-item__data">
                <TagGroup
                    :tags="props.title.tags"
                    :disabled="loading"
                    @add-tag="onAddTag"
                    @remove-tag="onRemoveTag"
                />

                <div class="mt-3">
                    <TitleName
                        :text="props.title.name"
                        :disabled="loading"
                        v-model:editing="isEditingName"
                        @change-name="onTitleNameChange"
                        variant="title"
                    />
                    <TitleName
                        :text="props.title.description"
                        :disabled="loading"
                        v-model:editing="isEditingDescription"
                        @change-name="onTitleDescriptionChange"
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

            <TitlePoster
                :poster="props.title.poster"
                :disabled="loading"
                @edit-poster="onEditPoster"
                class="title-item__poster"
            />
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
    }>();

    const titlesStore = useTitlesStore();
    const statuses = useStatuses();

    const isRemoveTitleMenuOpen = ref(false);
    const isEditingName = ref(false);
    const isEditingDescription = ref(false);
    const loading = ref(false);

    async function asyncAction(
        action: (...args: any[]) => void | Promise<unknown>
    ) {
        loading.value = true;
        await action();
        loading.value = false;
    }

    function onAddTag(tag: Tag) {
        asyncAction(async () => {
            await titlesStore.addTag(props.title.id, tag);
        });
    }
    function onRemoveTag(tag: Tag) {
        asyncAction(async () => {
            await titlesStore.removeTag(props.title.id, tag);
        });
    }
    function onRemoveTitle() {
        asyncAction(async () => {
            await titlesStore.removeTitle(props.title.id);
            isRemoveTitleMenuOpen.value = false;
        });
    }
    function onRatingChange(rating: string | number) {
        asyncAction(async () => {
            rating = typeof rating === "string" ? parseInt(rating) : rating;
            await titlesStore.rateTitle(props.title.id, rating);
        });
    }
    function onStatusSelected(status: TitleStatus) {
        asyncAction(async () => {
            await titlesStore.changeTitleStatus(props.title.id, status);
        });
    }
    function onTitleNameChange(name: string) {
        asyncAction(async () => {
            await titlesStore.changeTitleName(props.title.id, name);
            isEditingName.value = false;
        });
    }
    function onTitleDescriptionChange(description: string) {
        asyncAction(async () => {
            await titlesStore.changeTitleDescription(
                props.title.id,
                description
            );
            isEditingDescription.value = false;
        });
    }
    function onEditPoster(poster: TitlePoster) {
        asyncAction(async () => {
            await titlesStore.changeTitlePoster(props.title.id, poster);
        });
    }
</script>

<style scoped lang="scss">
    .title-item {
        &__poster {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 50%;
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
</style>
