<template>
    <div class="title-poster">
        <a :href="props.poster?.link">
            <Poster
                :position="props.poster?.position"
                :src="props.poster?.img"
                class="title-poster__poster"
            />
        </a>

        <VDialog v-model="isMenuOpen" max-width="800">
            <template #activator="{ props: slotProps }">
                <VBtn
                    v-bind="slotProps"
                    icon="mdi-pencil"
                    color="blue-grey"
                    class="title-poster__button"
                />
            </template>

            <FormEditPoster
                @close="close"
                @edit-poster="onEditPoster"
                :loading="props.loading"
                :poster="props.poster"
            />
        </VDialog>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        loading?: boolean;
        poster?: TitlePoster;
    }>();
    const emit = defineEmits<{
        editPoster: [poster: TitlePoster, closeFn: () => void];
    }>();

    const isMenuOpen = ref(false);

    function close() {
        isMenuOpen.value = false;
    }

    function onEditPoster(poster: TitlePoster) {
        emit("editPoster", poster, close);
    }
</script>

<style scoped lang="scss">
    .title-poster {
        position: relative;

        &:hover {
            .title-poster__button {
                bottom: 5%;
                transform: none;
            }

            .title-poster__poster {
                transform: scale(1.04);
            }
        }

        &__poster {
            width: 100%;
            height: 100%;
        }

        &__button {
            position: absolute;
            right: 18%;

            bottom: 0;
            transform: translateY(110%);
        }
    }
</style>
