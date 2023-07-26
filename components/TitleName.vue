<template>
    <div class="title-name" v-outside="close">
        <VForm v-if="isEditing" v-model="isValid" @submit.prevent="accept">
            <VTextField
                ref="input"
                v-model="value"
                :rules="rules"
                :loading="props.loading"
                :disabled="props.loading"
                density="compact"
                hide-details
                class="title-name__input"
            >
                <template #append-inner>
                    <VBtn
                        @click="accept"
                        variant="flat"
                        icon="mdi-check"
                        density="compact"
                        color="green"
                        class="title-name__accept"
                    />
                    <VBtn
                        @click="close"
                        variant="flat"
                        icon="mdi-close"
                        density="compact"
                        color="red"
                        class="title-name__accept"
                    />
                </template>
            </VTextField>
        </VForm>

        <VCardTitle v-if="!isEditing" class="title-name__content">
            {{ props.text }}
        </VCardTitle>
        <!-- <VCardSubtitle
            v-if="!isEditing && props.variant === 'subtitle'"
            class="title-name__content"
        >
            {{ props.text }}
        </VCardSubtitle>
        <slot v-if="!isEditing && props.variant === 'other'"></slot> -->

        <VBtn
            v-if="!isEditing"
            @click="edit"
            variant="plain"
            density="comfortable"
            icon="mdi-pencil"
            color="blue-grey-lighten-1"
            class="title-name__edit"
        />
    </div>
</template>

<script setup lang="ts">
    import type { VTextField } from "vuetify/components";
    // type Variant = "title" | "subtitle" | "other";

    const emit = defineEmits<{
        changeName: [name: string, stopEditingFn: typeof close];
    }>();

    const props = defineProps<{
        text: string;
        loading?: boolean;
        // variant: Variant;
    }>();

    const isValid = ref(false);
    const input = ref<InstanceType<typeof VTextField> | null>(null);
    const isEditing = ref(false);
    const value = ref(props.text);

    const rules = [
        (value: string) => {
            return value.length > 0 || "Название не может быть пустым";
        },
    ];

    function edit() {
        value.value = props.text;
        isEditing.value = true;
        nextTick(() => {
            input.value?.focus();
        });
    }

    function close() {
        isEditing.value = false;
    }

    function accept() {
        if (isValid.value) {
            emit("changeName", value.value, close);
        }
    }
</script>

<style scoped lang="scss">
    .title-name {
        &__content {
            display: inline;
            overflow-wrap: revert;
            white-space: revert;
        }

        &__accept {
            transform: scale(0.8);
        }

        &__title {
            text-overflow: revert;
            white-space: revert;
        }

        &__edit {
            display: inline;
            transform: scale(0.7) translateY(-4px);
        }

        &__input {
            resize: none;
        }
    }
</style>
