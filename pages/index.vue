<template>
    <TopBar />
    <ModuleListTitles />
</template>

<script setup lang="ts">
    onMounted(() => {
        navigateTo({
            name: "index",
            query: {
                page: 1,
            },
        });
    });
</script>
