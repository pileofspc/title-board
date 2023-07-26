<template>
    <VAppBar>
        <VContainer class="d-flex _container align-center" fluid>
            <VBtn v-for="link in links" :text="link" color="blue-grey" />
            <VAvatar color="grey-darken-1" size="48" class="ml-auto" />
        </VContainer>
    </VAppBar>
</template>

<script setup lang="ts">
    const links = ["Мои Тайтлы", "Пользователи"];
</script>
