<template>
    <VContainer fluid class="d-flex pa-0">
        <SearchBar class="flex-grow-1" />
        <VDialog>
            <template #activator="{ props: slotProps }">
                <VBtn
                    class="ml-4 h-auto"
                    text="Добавить"
                    color="blue-grey"
                    v-bind="slotProps"
                >
                    <template #prepend>
                        <VIcon icon="mdi-plus" />
                    </template>
                </VBtn>
            </template>

            <VCard>
                <VCardTitle>123</VCardTitle>
            </VCard>
        </VDialog>
    </VContainer>
</template>
