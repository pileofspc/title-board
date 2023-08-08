<template>
    <VApp>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </VApp>
</template>

<script setup lang="ts"></script>

<style lang="scss">
    @use "@mdi/font/css/materialdesignicons.css";
    @use "~/assets/styles/fonts";

    body {
        font-family: "Nunito", sans-serif;
    }

    ._container {
        max-width: 1200px;
    }

    .cover {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }
</style>
