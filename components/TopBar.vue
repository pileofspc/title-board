<template>
    <VContainer fluid class="d-flex pa-0">
        <SearchBar class="flex-grow-1" />
        <VBtn
            @click="onAddClick"
            class="ml-4 h-auto"
            text="Добавить"
            color="blue-grey"
        >
            <template #prepend>
                <VIcon icon="mdi-plus" />
            </template>
        </VBtn>
    </VContainer>
</template>

<script setup lang="ts">
    const globalStore = useGlobalStore();

    function onAddClick() {
        globalStore.isAddingTitle = true;
    }
</script>
