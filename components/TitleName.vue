<template>
    <div class="title-name" v-outside="close">
        <VForm
            v-if="props.editing ?? isEditing"
            v-model="isValid"
            @submit.prevent="accept"
        >
            <VTextField
                spellcheck="false"
                v-model="value"
                autofocus
                :rules="rules"
                :loading="props.loading"
                density="compact"
                hide-details
                class="title-name__input"
            >
                <template #append-inner>
                    <VBtn
                        @click="accept"
                        :disabled="props.disabled"
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

        <template v-else>
            <component
                :is="components[props.variant]"
                class="title-name__content"
            >
                {{ props.text }}
            </component>
            <!-- <VCardTitle
                v-if="props.variant === 'title'"
                class="title-name__content"
            >
                {{ props.text }}
            </VCardTitle>
            <VCardSubtitle
                v-else-if="props.variant === 'subtitle'"
                class="title-name__content"
            >
                {{ props.text }}
            </VCardSubtitle> -->

            <VBtn
                @click="edit"
                variant="plain"
                density="comfortable"
                icon="mdi-pencil"
                color="blue-grey-lighten-1"
                class="title-name__edit"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
    import { VCardTitle, VCardSubtitle } from "vuetify/components";

    const props = withDefaults(
        defineProps<{
            text: string;
            loading?: boolean;
            disabled?: boolean;
            editing?: boolean;
            variant?: keyof typeof components;
        }>(),
        {
            variant: "title",
        }
    );
    const emit = defineEmits<{
        nameChange: [name: string];
        "update:editing": [value: boolean];
    }>();

    const components = {
        title: VCardTitle,
        subtitle: VCardSubtitle,
    } as const;

    const isValid = ref(false);
    const isEditing = ref(false);
    const value = ref(props.text);

    const rules = [
        (value: string) => {
            return value.length > 0 || "Название не может быть пустым";
        },
    ];

    function edit() {
        value.value = props.text;
        isDefined(props.editing)
            ? emit("update:editing", true)
            : (isEditing.value = true);
    }

    function close() {
        isDefined(props.editing)
            ? emit("update:editing", false)
            : (isEditing.value = false);
    }

    function accept() {
        if (isValid.value) {
            emit("nameChange", value.value);
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
