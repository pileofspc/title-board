<template>
    <VCard v-if="loading" loading rounded="lg" min-height="230" class="card" />
    <template v-else>
        <TransitionGroup>
            <div v-if="titlesStore.titles.length === 0" key="nothing">
                Пока ничего нет :(
            </div>
            <TitleItem
                v-for="title in titlesStore.titles"
                :title="title"
                :key="title.id"
                class="mt-4"
            />
        </TransitionGroup>
    </template>
</template>

<script setup lang="ts">
    const titlesStore = useTitlesStore();

    const loading = ref(true);
    titlesStore.fetchTitles().then(() => {
        loading.value = false;
    });
</script>

<style scoped lang="scss">
    .v-move,
    .v-enter-active,
    .v-leave-active {
        transition: all 0.5s ease;
    }
    .v-enter-from,
    .v-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }

    .v-leave-active {
        // TODO: Придумать как сделать без назначения ширины
        // https://jsfiddle.net/soxv3vr0/
        position: absolute;
        width: 1168px;
    }
</style>
