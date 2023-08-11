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
                    emit('close');
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
            @click="emit('close')"
        >
            Нет
        </VBtn>
    </VCard>
</template>

<script setup lang="ts">
    const emit = defineEmits<{
        confirm: [];
        close: [];
    }>();

    const props = defineProps({
        loading: {
            type: Boolean,
        },
        disabled: {
            type: Boolean,
        },
    });
</script>
