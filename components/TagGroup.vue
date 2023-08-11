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
                    class="tag-group__close-tag"
                    variant="tonal"
                    icon="mdi-close"
                    density="compact"
                    :loading="props.loading"
                    :disabled="props.disabled"
                    @click="emit('removeTag', tag)"
                />
            </VChip>
        </TransitionGroup>

        <VMenu
            :model-value="props.menu ?? isMenuOpen"
            @update:model-value="onMenuToggle"
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
                :disabled="props.disabled"
                @close="closeMenu"
                @add-tag="(tag) => emit('addTag', tag)"
            />
        </VMenu>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        tags: {
            type: Array as PropType<Tag[]>,
            default: [],
        },
        loading: {
            type: Boolean,
        },
        disabled: {
            type: Boolean,
        },
        menu: {
            type: Boolean,
            default: undefined,
        },
    });
    const emit = defineEmits<{
        addTag: [tag: Tag];
        removeTag: [tag: Tag];
        "update:menu": [value: boolean];
    }>();

    const isMenuOpen = ref(false);
    function onMenuToggle(value: boolean) {
        if (props.menu === undefined) {
            (isMenuOpen as Ref<boolean>).value = value;
        } else {
            emit("update:menu", value);
        }
    }
    function closeMenu() {
        if (props.menu !== undefined) {
            emit("update:menu", false);
        } else {
            isMenuOpen.value = false;
        }
    }
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
