<template>
    <div class="tag-group">
        <TransitionGroup>
            <VChip
                v-for="tag in props.tags"
                :key="tag.id"
                variant="elevated"
                :color="tag.color"
                class="tag-group__tag"
            >
                {{ tag.text }}

                <VBtn
                    @click="() => emit('removeTag', tag)"
                    variant="tonal"
                    icon="mdi-close"
                    density="compact"
                    :loading="props.loading"
                    class="tag-group__close-tag"
                />
            </VChip>
        </TransitionGroup>

        <VMenu
            v-model="isMenuOpen"
            location="bottom start"
            :close-on-content-click="false"
            offset="8"
        >
            <template #activator="{ props: slotProps }">
                <VChip
                    prepend-icon="mdi-plus"
                    color="blue-grey"
                    v-bind="slotProps"
                >
                    Добавить тег
                </VChip>
            </template>

            <FormAddTag
                :loading="props.loading"
                @close="isMenuOpen = false"
                @add-tag="onAddTag"
            />
        </VMenu>
    </div>
</template>

<script setup lang="ts">
    import type { VChip } from "vuetify/lib/components/index.mjs";

    const emit = defineEmits<{
        addTag: [Tag];
        removeTag: [Tag];
    }>();

    const props = defineProps({
        tags: {
            type: Array as PropType<Tag[]>,
            default: [],
        },
        loading: {
            type: Boolean,
        },
        titleId: {
            type: String,
            required: true,
        },
    });

    const isMenuOpen = ref(false);

    function onAddTag(tag: Tag) {
        emit("addTag", tag);
    }
    function closeMenu() {
        isMenuOpen.value = false;
    }

    defineExpose({
        closeMenu,
    });
</script>

<style scoped lang="scss">
    .tag-group {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;

        &__tag {
            white-space: normal;
            overflow-wrap: break-word;
            height: auto;
            min-height: 30px;
        }

        &__close-tag {
            transform: scale(0.7) translateX(8px);
        }
    }

    .v-enter-active,
    .v-leave-active {
        transition: all 0.4s ease;
    }
    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }
</style>
