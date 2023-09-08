<template>
    <VCard class="change-status">
        <VList>
            <VListItem
                v-for="(status, key) in statuses"
                :key="status.display"
                :base-color="status.color"
                :value="status.display"
                :title="status.display"
                @click="emit('selected', key)"
            />
        </VList>
    </VCard>
</template>

<script setup lang="ts">
    import { statuses } from "~/constants";

    const emit = defineEmits<{
        selected: [statusKey: TitleStatus];
    }>();
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
