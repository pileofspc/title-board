<template>
    <VCard class="change-status">
        <VList>
            <VListItem
                v-for="(status, key) in statuses"
                :key="status.display"
                color="blue-grey"
                :value="status.display"
                :title="status.display"
                @click="emit('selected', key)"
            />
        </VList>
    </VCard>
</template>

<script setup lang="ts">
    const emit = defineEmits<{
        selected: [statusKey: TitleStatus];
    }>();
    const statuses = useStatuses();
</script>

<style scoped lang="scss">
    .change-status {
        &__statuses {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        &__status {
            white-space: normal;
            overflow-wrap: break-word;
            height: auto;
            min-height: 30px;
        }
    }
</style>
