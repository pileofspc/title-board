<template>
    <VLazy class="poster">
        <img
            class="poster__image"
            src="https://www.lenbaget.ru/wp-content/uploads/2021/11/3835-1000x830-1.jpg"
        />
    </VLazy>
</template>

<style scoped lang="scss">
    .poster {
        transition: transform 0.2s;
        clip-path: polygon(15% 0, 95% 0px, 85% 100%, 5% 100%);

        &:hover {
            transform: scale(1.04);
        }

        &__image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: 50% 50%;
        }
    }
</style>
