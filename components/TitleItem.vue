<template>
    <VCard class="card" rounded="lg" :loading="titleLoading">
        <VCardItem>
            <div class="title-item__data">
                <TagGroup
                    :tags="props.title.tags"
                    :loading="tagsLoading"
                    :disabled="titleLoading"
                    @add-tag="onAddTag"
                    @remove-tag="onRemoveTag"
                />

                <div class="mt-3">
                    <VCardTitle>Атака титанов</VCardTitle>
                    <VCardSubtitle style="white-space: normal">
                        Сёнэн, темное фэнтези, драма, 12 серий, Сёнэн, темное
                        фэнтези, драма, 12 серий, Сёнэн, темное фэнтези, драма,
                        12 серий
                    </VCardSubtitle>
                </div>

                <div class="mt-3">
                    <VMenu location="bottom start" offset="8">
                        <template #activator="{ props: slotProps }">
                            <VChip
                                :disabled="statusLoading"
                                :color="statuses[props.title.status].color"
                                v-bind="slotProps"
                            >
                                {{ statuses[props.title.status].display }}
                            </VChip>
                        </template>

                        <FormChangeStatus @selected="onStatusSelected" />
                    </VMenu>
                </div>

                <VRating
                    class="mt-3"
                    hover
                    half-increments
                    size="30"
                    active-color="yellow-darken-3"
                    color="blue-grey"
                    :disabled="titleLoading || ratingLoading"
                    v-model="props.title.rating"
                    @update:model-value="onRatingChange"
                />

                <div class="title-item__controls">
                    <VDialog>
                        <template #activator="{ props: slotProps }">
                            <VBtn
                                v-bind="slotProps"
                                icon="mdi-pencil"
                                size="small"
                                variant="tonal"
                                color="blue-grey"
                            />
                        </template>

                        <FormAddTag :id="props.title.id" />
                    </VDialog>

                    <VMenu
                        :close-on-content-click="false"
                        location="top right"
                        offset="8"
                        v-model="isMenuOpen"
                    >
                        <template #activator="{ props: slotProps }">
                            <VBtn
                                v-bind="slotProps"
                                icon="mdi-delete"
                                size="small"
                                variant="tonal"
                                class="ml-2"
                                color="blue-grey"
                            />
                        </template>

                        <FormConfirm
                            :loading="titleLoading"
                            @confirm="onRemoveTitle"
                            @close="isMenuOpen = false"
                        />
                    </VMenu>
                </div>
            </div>

            <Poster class="title-item__poster" />
        </VCardItem>
    </VCard>
</template>

<script setup lang="ts">
    const props = defineProps({
        title: {
            type: Object as PropType<Title>,
            required: true,
        },
    });

    const titlesStore = useTitlesStore();
    const statuses = useStatuses();

    const isMenuOpen = ref(false);
    const tagsLoading = ref(false);
    const ratingLoading = ref(false);
    const titleLoading = ref(false);
    const statusLoading = ref(false);

    async function onAddTag(tag: Tag, closeMenuFn: () => void) {
        tagsLoading.value = true;
        await titlesStore.addTag(props.title.id, tag);
        closeMenuFn();
        tagsLoading.value = false;
    }
    async function onRemoveTag(tag: Tag) {
        tagsLoading.value = true;
        await titlesStore.removeTag(props.title.id, tag);
        tagsLoading.value = false;
    }
    async function onRemoveTitle() {
        titleLoading.value = true;
        await titlesStore.removeTitle(props.title.id);
        titleLoading.value = false;
        isMenuOpen.value = false;
    }
    async function onRatingChange(rating: string | number) {
        rating = typeof rating === "string" ? parseInt(rating) : rating;
        ratingLoading.value = true;
        await titlesStore.rateTitle(props.title.id, rating);
        ratingLoading.value = false;
    }
    async function onStatusSelected(status: TitleStatus) {
        statusLoading.value = true;
        await titlesStore.changeStatus(props.title.id, status);
        statusLoading.value = false;
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
