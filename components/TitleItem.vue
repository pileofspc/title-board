<template>
    <VCard class="card" rounded="lg" :loading="titleLoading">
        <VCardItem>
            <div class="title-item__data">
                <TagGroup
                    :tags="props.title.tags"
                    :title-id="props.title.id"
                    :loading="tagsLoading || titleLoading"
                    ref="tagGroup"
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
                    <VMenu
                        location="bottom start"
                        :close-on-content-click="false"
                    >
                        <template #activator="{ props: slotProps }">
                            <VChip color="green" v-bind="slotProps">
                                Просмотрено
                            </VChip>
                        </template>

                        <VCard>
                            <VCardTitle> 123 </VCardTitle>
                        </VCard>
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
                        v-model="isRemoveTitleMenuOpen"
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

                        <VCard class="pa-3">
                            <div class="mb-2">Вы уверены?</div>
                            <VBtn
                                variant="tonal"
                                color="blue-grey"
                                prepend-icon="mdi-check-circle-outline"
                                :loading="
                                    titleLoading || tagsLoading || ratingLoading
                                "
                                @click="onRemoveTitle"
                            >
                                Да
                            </VBtn>
                            <VBtn
                                variant="tonal"
                                color="blue-grey"
                                class="ml-2"
                                prepend-icon="mdi-close-circle-outline"
                                @click="isRemoveTitleMenuOpen = false"
                            >
                                Нет
                            </VBtn>
                        </VCard>
                    </VMenu>
                </div>
            </div>

            <Poster class="title-item__poster" />
        </VCardItem>
    </VCard>
</template>

<script setup lang="ts">
    import type { TagGroup } from ".nuxt/components";

    const props = defineProps({
        title: {
            type: Object as PropType<Title>,
            required: true,
        },
    });

    const titlesStore = useTitlesStore();

    const isRemoveTitleMenuOpen = ref(false);
    const tagsLoading = ref(false);
    const ratingLoading = ref(false);
    const titleLoading = ref(false);

    const tagGroup = ref<InstanceType<typeof TagGroup> | null>(null);
    async function onAddTag(tag: Tag) {
        tagsLoading.value = true;
        await titlesStore.addTag(props.title.id, tag);
        tagGroup.value?.closeMenu();
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
        isRemoveTitleMenuOpen.value = false;
    }

    async function onRatingChange(rating: string | number) {
        rating = typeof rating === "string" ? parseInt(rating) : rating;

        ratingLoading.value = true;
        await titlesStore.rateTitle(props.title.id, rating);
        ratingLoading.value = false;
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
