<template>
    <div
        @dragstart.prevent
        @pointerdown="onPointerDown"
        class="poster-position"
    >
        <Poster
            :position="props.position"
            :src="props.src"
            @load="
                (width, height) => {
                    aspectRatioNatural = width / height;
                }
            "
        />
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        position?: Position;
        src?: string;
    }>();
    const emit = defineEmits<{
        updatePosition: [x: number, y: number];
    }>();

    const clickPos: Position = {
        x: 50,
        y: 50,
    };
    const savedPos: Position = {
        x: 50,
        y: 50,
    };
    let containerWidth: number;
    let containerHeight: number;
    let imageWidth: number;
    let imageHeight: number;
    let aspectRatioNatural: number;

    function onPointerDown(e: PointerEvent) {
        if (!props.src || !props.position) {
            return;
        }
        const target = e.currentTarget as HTMLDivElement;

        savedPos.x = props.position.x;
        savedPos.y = props.position.y;

        clickPos.x = e.offsetX;
        clickPos.y = e.offsetY;
        containerWidth = target.offsetWidth;
        containerHeight = target.offsetHeight;

        if (containerWidth / containerHeight > aspectRatioNatural) {
            imageWidth = containerWidth;
            imageHeight = containerWidth / aspectRatioNatural;
        } else {
            imageHeight = containerHeight;
            imageWidth = containerHeight * aspectRatioNatural;
        }

        target.setPointerCapture(e.pointerId);
        target.addEventListener("pointermove", onPointerMove);
        target.addEventListener(
            "pointerup",
            (e) => {
                target.removeEventListener("pointermove", onPointerMove);
            },
            {
                once: true,
            }
        );
    }

    function onPointerMove(e: PointerEvent) {
        if (!props.src || !props.position) {
            return;
        }
        // Нужно сдвинуть изображение на столько ПИКСЕЛЕЙ, но мы можем двигать только в процентах
        // (container width - image width) * (position x%) = (x offset value)
        // (container height - image height) * (position y%) = (y offset value)
        // (position x%) = (x offset value) / (container width - image width)

        const offsetX = e.offsetX - clickPos.x;
        const offsetY = e.offsetY - clickPos.y;

        // В случае, если imageWidth === containerWidth передаем ноль, чтобы не было деления на ноль и NaN
        const offsetXPercentage =
            (offsetX / (imageWidth - containerWidth)) * 100 || 0;
        const resultX = savedPos.x - offsetXPercentage;
        const offsetYPercentage =
            (offsetY / (imageHeight - containerHeight)) * 100 || 0;
        const resultY = savedPos.y - offsetYPercentage;

        emit("updatePosition", clamp(0, resultX, 100), clamp(0, resultY, 100));
    }

    function clamp(min: number, val: number, max: number) {
        return Math.max(Math.min(val, max), min);
    }
</script>

<style scoped lang="scss">
    .poster-position {
        cursor: grab;
        touch-action: none;
        &:active {
            cursor: grabbing;
        }
    }
</style>
