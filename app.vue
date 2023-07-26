<template>
    <VApp>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </VApp>
</template>

<script setup lang="ts"></script>

<style lang="scss">
    @use "~/assets/styles/fonts";

    body {
        font-family: "Nunito", sans-serif;
    }

    ._container {
        max-width: 1200px;
    }
</style>
