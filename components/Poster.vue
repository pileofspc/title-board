<template>
    <div class="poster">
        <div class="poster__cover">
            <slot name="cover"></slot>
        </div>
        <!-- Обязательно нужно передать компоненту VImg пропс aspect-ratio (или установить высоту) и растянуть VImg  по родительскому диву (класс poster__v-img)  -->
        <VImg
            ref="vimg"
            :src="props.src || Missing"
            cover
            aspect-ratio="2.595"
            class="poster__v-img"
            @load="onImageLoad"
            @loadstart="emit('imageMissing')"
            @error="emit('imageMissing')"
        >
            <template #placeholder>
                <div class="cover">
                    <VProgressCircular color="grey" indeterminate />
                </div>
            </template>
            <template #error>
                <img
                    :src="Missing"
                    alt="Изображение недоступно"
                    class="poster__error"
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
        imageMissing: [];
    }>();

    const defaultPos: Position = {
        x: 50,
        y: 50,
    };

    let watcherStop: ReturnType<typeof watch>;
    const vimg = ref<InstanceType<typeof VImg> | null>(null);
    function onImageLoad() {
        if (watcherStop) {
            watcherStop();
        }
        watcherStop = watch(
            props,
            () => {
                if (vimg.value?.image) {
                    vimg.value.image.style.objectPosition = `${
                        props.position?.x ?? defaultPos.x
                    }% ${props.position?.y ?? defaultPos.y}%`;
                }
            },
            {
                immediate: true,
            }
        );

        !props.src
            ? emit("imageMissing")
            : emit(
                  "load",
                  vimg.value?.image?.naturalWidth!,
                  vimg.value?.image?.naturalHeight!
              );
    }

    onBeforeUnmount(() => {
        if (watcherStop) {
            watcherStop();
        }
    });
</script>

<style scoped lang="scss">
    .poster {
        position: relative;
        transition: transform 0.2s;
        clip-path: polygon(15% 0, 95% 0px, 85% 100%, 5% 100%);
        overflow: hidden;

        &__v-img {
            width: 100%;
            height: 100%;
        }

        &__error {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        &__cover {
            position: absolute;
            inset: 0;
            z-index: 1;
        }
    }
</style>
