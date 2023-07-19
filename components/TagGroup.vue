<template>
    <div class="chip-group">
        <VChip
            v-for="tag in props.tags"
            variant="elevated"
            closable
            :color="tag.color"
            class="chip-group__chip"
        >
            {{ tag.text }}
        </VChip>

        <VMenu
            v-model="isMenuOpen"
            location="bottom start"
            :close-on-content-click="false"
            offset="8"
        >
            <template #activator="{ props: slotProps }">
                <VChip
                    prepend-icon="mdi-plus"
                    v-bind="slotProps"
                    :color="color"
                >
                    Добавить тег
                </VChip>
            </template>

            <FormAddTag @close="isMenuOpen = false" />
        </VMenu>
    </div>
</template>

<script setup lang="ts">
    const color = useColor();

    const isMenuOpen = ref(false);

    const props = defineProps({
        tags: Array as PropType<Tag[]>,
    });
</script>

<style lang="scss" scoped>
    .chip-group {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;

        &__chip {
            white-space: normal;
            height: auto;
            min-height: 30px;
        }
    }
</style>
