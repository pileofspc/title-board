<template>
    <VCard class="card" rounded="lg">
        <VCardItem>
            <VChipGroup>
                <VChip closable>Пользовательский тег 1</VChip>
                <VChip closable>Круто</VChip>
                <VChip closable>Очень плохо</VChip>

                <VChip>Добавить</VChip>
            </VChipGroup>

            <div class="d-flex align-center">
                <VCardTitle>Название Аниме</VCardTitle>
                <VChip class="ml-2">12 серий</VChip>
            </div>

            <VCardSubtitle>Название Жанра</VCardSubtitle>

            <VChipGroup>
                <VChip>Просмотрено</VChip>
            </VChipGroup>

            <VRating hover half-increments />

            <Poster />
        </VCardItem>
    </VCard>
</template>

<script setup lang="ts">
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

<style scoped lang="scss"></style>
