<template>
    <VAppBar>
        <VContainer class="d-flex maxw-xl align-center" fluid>
            <VBtn v-for="link in links" :text="link" />
            <VAvatar color="grey-darken-1" size="48" class="ml-auto" />
        </VContainer>
    </VAppBar>
</template>

<script setup lang="ts">
    const links = ["Список тайтлов", "Список пользователей"];
</script>
