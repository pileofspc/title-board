<template>
    <div class="tag-group">
        <TransitionGroup @before-leave="beforeLeave" @after-leave="afterLeave">
            <VChip
                v-for="tag in props.tags"
                :key="tag.id"
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
            <!-- пустой @click добавлен, чтобы применились стили, а сама менюшка вынесена из TransitionGroup, чтобы
            работали анимации появления и исчезновения элементов -->
            <!-- TODO: Понять как реализовано то, что при назначении @click меняется поведение компонента, независимое от этого обработчика (даже если он пустой) -->
            <!-- TODO:  Если получится - сделать чтобы кнопка добавить появлялась с конца а не с начала -->
            <VChip
                ref="menuActivator"
                v-show="!isAtMaxTags"
                key="add"
                @click=""
                prepend-icon="mdi-plus"
                color="blue-grey"
                class="transition"
            >
                Добавить тег
            </VChip>
        </TransitionGroup>

        <VMenu
            :model-value="props.menu ?? isMenuOpen"
            @update:model-value="onMenuToggle"
            :activator="(menuActivator as ComponentPublicInstance)"
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
    </div>
</template>

<script setup lang="ts">
    import type { VChip } from "vuetify/lib/components/index.mjs";

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

    const menuActivator = ref<InstanceType<typeof VChip> | null>(null);
    const maxTags = 10;
    const isMenuOpen = ref(false);
    const isAtMaxTags = computed(() => props.tags.length >= maxTags);
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
