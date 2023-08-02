<template>
    <div class="poster">
        <!-- Обязательно нужно передать компоненту VImg пропс aspect-ratio (или установить высоту) и растянуть VImg  по родительскому диву (класс poster__v-img)  -->
        <VImg
            ref="vimg"
            :src="props.src || Missing"
            cover
            aspect-ratio="2.595"
            class="poster__v-img"
            @load="onImageLoad"
        >
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
    import type { VImg } from "vuetify/lib/components/index.mjs";

    const props = defineProps<{
        src?: string;
        position?: Position;
    }>();
    const emit = defineEmits<{
        load: [imageWidth: number, imageHeight: number];
    }>();

    const vimg = ref<InstanceType<typeof VImg> | null>(null);
    watch(props, () => {
        if (vimg.value?.image) {
            vimg.value.image.style.objectPosition = `${
                props.position?.x ?? 50
            }% ${props.position?.y ?? 50}%`;
        }
    });

    function onImageLoad() {
        emit(
            "load",
            vimg.value?.image?.naturalWidth!,
            vimg.value?.image?.naturalHeight!
        );
    }
</script>

<style scoped lang="scss">
    .poster {
        transition: transform 0.2s;
        clip-path: polygon(15% 0, 95% 0px, 85% 100%, 5% 100%);
        overflow: hidden;

        &__v-img {
            width: 100%;
            height: 100%;
        }

        &__image {
            width: 100%;
        }
    }
</style>
