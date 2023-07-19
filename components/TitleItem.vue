<template>
    <VCard class="card" rounded="lg">
        <VCardItem>
            <div class="title-item__data">
                <TagGroup :tags="tags" />

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
                        <KeepAlive>
                            <FormAddTag />
                        </KeepAlive>
                    </VMenu>
                </div>

                <VRating
                    class="mt-3"
                    hover
                    half-increments
                    size="30"
                    active-color="yellow-darken-3"
                    color="blue-grey"
                />

                <div class="title-item__controls">
                    <VDialog>
                        <template #activator="{ props: slotProps }">
                            <VBtn
                                v-bind="slotProps"
                                icon="mdi-pencil"
                                size="small"
                                variant="tonal"
                                :color="btnColor"
                            />
                        </template>

                        <FormAddTag />
                    </VDialog>

                    <VMenu
                        :close-on-content-click="false"
                        location="top right"
                        offset="8"
                    >
                        <template #activator="{ props: slotProps }">
                            <VBtn
                                v-bind="slotProps"
                                icon="mdi-delete"
                                size="small"
                                variant="tonal"
                                class="ml-2"
                                :color="btnColor"
                            />
                        </template>
                        <VCard class="pa-3">
                            <div class="mb-2">Вы уверены?</div>
                            <VBtn
                                variant="tonal"
                                color="blue-grey"
                                prepend-icon="mdi-check-circle-outline"
                            >
                                Да
                            </VBtn>
                            <VBtn
                                variant="tonal"
                                color="blue-grey"
                                class="ml-2"
                                prepend-icon="mdi-close-circle-outline"
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
    const btnColor = useColor();

    const tags = ref<Tag[]>([
        {
            color: "red",
            text: "Пользовательский тег 1",
        },
        {
            color: "green",
            text: "Тег2",
        },
        {
            color: "blue",
            text: "Тег3",
        },
        {
            color: "amber",
            text: "Тег4",
        },
    ]);

    function setTags(newTags: Tag[]) {
        tags.value = newTags;
    }
    // const props = defineProps({
    //     btnColor: {
    //         type: String,
    //     },
    // });

    // const props = defineProps({
    //     itemName: {
    //         type: String,
    //         required: true,
    //     },
    //     img: {
    //         type: String,
    //         required: true,
    //     },
    //     length: {
    //         type: Number,
    //     },
    //     tags: {
    //         type: Array,
    //     },
    //     statusTag: {
    //         type: String,
    //     },
    //     rating: {
    //         type: Number,
    //     },
    // });
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
