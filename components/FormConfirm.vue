<template>
    <VCard class="pa-3">
        <div class="mb-2">Вы уверены?</div>
        <VBtn
            variant="tonal"
            color="blue-grey"
            prepend-icon="mdi-check-circle-outline"
            :loading="props.loading"
            :disabled="props.disabled"
            @click="
                () => {
                    emit('confirm');
                    emit('cancel');
                }
            "
        >
            Да
        </VBtn>
        <VBtn
            variant="tonal"
            color="blue-grey"
            class="ml-2"
            prepend-icon="mdi-close-circle-outline"
            @click="emit('cancel')"
        >
            Нет
        </VBtn>
    </VCard>
</template>

<script setup lang="ts">
    const props = defineProps({
        loading: {
            type: Boolean,
        },
        disabled: {
            type: Boolean,
        },
    });
    const emit = defineEmits<{
        confirm: [];
        cancel: [];
    }>();
</script>
