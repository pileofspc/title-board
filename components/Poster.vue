<template>
    <div class="poster d-flex">
        <VImg
            class="poster__image"
            cover
            src="https://www.lenbaget.ru/wp-content/uploads/2021/11/3835-1000x830-1.jpg"
        />
        <div class="poster__sidepanel-left"></div>
        <div class="poster__sidepanel-right"></div>
    </div>
</template>

<style scoped lang="scss">
    .poster {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 50%;

        &:hover {
            // .poster__image {
            //     transform: scale(1.05);
            // }

            transition: transform 0.2s;
            transform: scale(1.05);
        }

        // &__image {
        //     transition: transform 0.2s ease;
        // }

        &__sidepanel-left {
            position: absolute;
            top: 0;
            left: 0;
            border-top: 350px solid white;
            border-right: 100px solid transparent;
        }

        &__sidepanel-right {
            position: absolute;
            bottom: 0;
            right: 0;
            border-top: 350px solid transparent;
            border-right: 100px solid white;
        }
    }
</style>
