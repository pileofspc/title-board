<template>
    <TopBar />
    <ModuleListTitles />
</template>

<script setup lang="ts">
    definePageMeta({
        middleware: (to, from) => {
            if (!to.query.page) {
                return navigateTo({
                    name: "index",
                    query: {
                        page: 1,
                    },
                });
            }
            if (!(Number(to.query.page) > 0)) {
                return abortNavigation({
                    statusCode: 404,
                    statusMessage: "Page Not Found",
                });
            }
        },
    });
</script>
