<template>
    <div class="poster">
        <VImg :src="props.img || Missing" cover class="poster__image">
            <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                    <VProgressCircular color="grey" indeterminate />
                </div>
            </template>
            <template #error>
                <img
                    :src="Missing"
                    alt="Изображение недоступно"
                    class="poster__image"
                />
            </template>
        </VImg>
    </div>
</template>

<script setup lang="ts">
    import Missing from "~/assets/images/missing.jfif";
    const props = defineProps<{
        img?: string;
    }>();
</script>

<style scoped lang="scss">
    .poster {
        transition: transform 0.2s;
        clip-path: polygon(15% 0, 95% 0px, 85% 100%, 5% 100%);

        &__image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: 50% 50%;
        }
    }
</style>
