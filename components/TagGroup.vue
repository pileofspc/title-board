<template>
    <div class="tag-group">
        <TransitionGroup @before-leave="beforeLeave" @after-leave="afterLeave">
            <VChip
                v-for="(tag, index) in props.tags"
                :key="tag.uuid || index"
                variant="elevated"
                :color="tag.color"
                class="tag-group__tag transition"
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

            <VChip
                v-if="!isAtMaxTags"
                key="add"
                link
                prepend-icon="mdi-plus"
                color="blue-grey"
                class="transition"
            >
                Добавить тег

                <VMenu
                    :model-value="props.menu ?? isMenuOpen"
                    @update:model-value="onMenuToggle"
                    activator="parent"
                    location="bottom start"
                    :close-on-content-click="false"
                    offset="8"
                >
                    <FormAddTag
                        :loading="props.loading"
                        :disabled="props.disabled || isAtMaxTags"
                        @close="closeMenu"
                        @add-tag="(tag) => emit('addTag', tag)"
                    />
                </VMenu>
            </VChip>
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
    import type { VChip } from "vuetify/lib/components/index.mjs";
    // <!-- TODO:  Если получится - сделать чтобы анмация появления кнопки добавить была с конца а не с начала -->
    // TODO: Выяснить почему на 24 строке происходит ошибка гидратации если использовать v-show, но не происходит, если использовать v-if

    const props = defineProps({
        tags: {
            type: Array as PropType<TagPartial[]>,
            default: [],
        },
        maxTags: {
            type: [Number, String],
        },
        loading: {
            type: Boolean,
        },
        disabled: {
            type: Boolean,
        },
        // TODO: Переделать пропс menu
        menu: {
            type: Boolean,
            default: undefined,
        },
    });
    const emit = defineEmits<{
        addTag: [tag: TagPartial];
        removeTag: [tag: TagPartial];
        "update:menu": [value: boolean];
    }>();

    const isMenuOpen = ref(false);
    const isAtMaxTags = computed(() => {
        if (!props.maxTags) return false;
        const num =
            typeof props.maxTags === "string"
                ? parseInt(props.maxTags)
                : props.maxTags;
        return props.tags.length >= num;
    });
    watch(
        isAtMaxTags,
        (val) => {
            if (val) {
                isMenuOpen.value = false;
            }
        },
        { immediate: true }
    );
    function onMenuToggle(value: boolean) {
        if (props.menu === undefined) {
            isMenuOpen.value = value;
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

    function beforeLeave(element: Element) {
        const el = element as HTMLElement;
        const rect = getCoords(el);
        el.style.left = `${el.offsetLeft}px`;
        el.style.top = `${el.offsetTop}px`;
        el.style.width = `${rect.width}px`;
        el.style.height = `${rect.height}px`;
    }
    function afterLeave(element: Element) {
        const el = element as HTMLElement;
        el.style.left = "";
        el.style.top = "";
        el.style.width = "";
        el.style.height = "";
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

    .transition {
        transform-origin: left center;
    }

    .v-enter-active,
    .v-leave-active,
    .v-move {
        transition: all 0.4s ease;
    }

    .v-enter-from,
    .v-leave-to {
        transform: scaleX(0.01) scaleY(0.5);
        opacity: 0;
    }

    .v-leave-active {
        position: absolute;
    }
</style>
