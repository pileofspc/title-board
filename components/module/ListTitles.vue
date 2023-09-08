<template>
    <div class="title-list">
        <Transition name="placeholder" @enter="onEnter">
            <ModuleTitlePlaceholder class="placeholder" />
        </Transition>

        <div
            :style="{
                transform: transform(),
            }"
            class="title-list__titles"
        >
            <VCard
                v-if="loading"
                loading
                rounded="lg"
                min-height="230"
                class="card"
            />

            <template v-else>
                <TransitionGroup @before-leave="beforeLeave">
                    <div v-if="titles.length === 0" key="nothing">
                        Пока ничего нет :(
                    </div>

                    <ModuleTitle
                        v-for="title in titles"
                        :title="title"
                        :key="title.id"
                        class="mt-4"
                    />
                </TransitionGroup>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { ModuleTitlePlaceholder } from ".nuxt/components";

    const titlesStore = useTitlesStore();
    const titles = computed(() => titlesStore.titles);

    // const isAddingTitle = ref(true);
    // setInterval(() => {
    //     isAddingTitle.value = !isAddingTitle.value;
    // }, 2000);

    const loading = ref(true);
    titlesStore.fetchTitles().then(() => {
        loading.value = false;
    });

    function beforeLeave(element: Element) {
        const el = element as HTMLElement;
        const rect = getCoords(el);
        el.style.width = `${rect.width}px`;
    }
    // FIXME: При удалении тайтла почему-то происходит анимация тегов

    // function beforeEnter(element: Element) {
    //     const el = element as HTMLElement;
    //     el.style.overflow = "hidden";
    //     el.style.maxHeight = "0px";
    //     el.style.setProperty("margin-top", "0", "important");
    //     el.style.setProperty("padding-block", "0", "important");
    //     el.style.transition =
    //         "max-height 2.6s, padding-block 2.6s, margin-top 2.6s";
    // }
    // function onEnter(element: Element, done: () => void) {
    //     const el = element as HTMLElement;
    //     el.addEventListener("transitionend", function listener(e) {
    //         if (e.target !== e.currentTarget) return;
    //         el.removeEventListener("transitionend", listener);
    //         done();
    //     });
    //     el.style.maxHeight = `${el.scrollHeight + 24}px`;
    //     el.style.removeProperty("margin-top");
    //     el.style.removeProperty("padding-block");
    // }
    // function afterEnter(element: Element) {
    //     const el = element as HTMLElement;
    // }
    // function onLeave(element: Element, done: () => void) {
    //     const el = element as HTMLElement;
    //     el.addEventListener("transitionend", function listener(e) {
    //         if (e.target !== e.currentTarget) return;
    //         el.removeEventListener("transitionend", listener);
    //         done();
    //     });
    //     el.style.maxHeight = "0";
    //     el.style.setProperty("padding-block", "0", "important");
    //     el.style.setProperty("margin-top", "0", "important");
    // }

    const globalStore = useGlobalStore();
    const height = ref("0");

    function onEnter(element: Element) {
        const el = element as HTMLElement;
        const observer = new ResizeObserver((entries) => {
            console.log(entries[0]);
        });
        observer.observe(el);
    }

    const transform = () =>
        globalStore.isAddingTitle ? `translateY(${2})` : "";
</script>

<style scoped lang="scss">
    .v-move,
    .v-enter-active,
    .v-leave-active {
        transition: all 0.6s ease;
    }
    .v-enter-from,
    .v-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }
    .v-leave-active {
        position: absolute;
    }

    .title-list {
        position: relative;

        &__titles {
            transition: transform 0.6s ease;
        }
    }
    .placeholder {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        transform: scaleY(1);
        transform-origin: 50% 0%;
        transition: transform 0.6s ease;
    }
    .placeholder-enter-from,
    .placeholder-leave-to {
        transform: scaleY(0);
    }
</style>
