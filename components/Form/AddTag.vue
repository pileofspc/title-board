<template>
    <VCard class="add-tag">
        <VContainer>
            <VForm @submit.prevent="onAddTag" v-model="valid">
                <div class="mb-2">Цвет</div>
                <div class="add-tag__colors">
                    <VBtn
                        v-for="color in colors"
                        @click="selectColor(color)"
                        density="compact"
                        :color="color"
                        :class="{
                            'add-tag__selected': selectedColor === color,
                        }"
                        class="add-tag__color"
                    />
                </div>

                <div class="mt-4">Текст</div>
                <VTextField
                    ref="input"
                    v-model="tagText"
                    clearable
                    @click:clear="tagText = ''"
                    :maxlength="50"
                    :rules="rules"
                    counter
                    density="compact"
                />

                <VCardActions class="justify-end">
                    <VBtn
                        type="submit"
                        :loading="props.loading"
                        :disabled="props.disabled"
                        variant="elevated"
                        color="blue-grey"
                        class="mt-2"
                    >
                        Добавить
                    </VBtn>
                    <VBtn
                        @click="emit('close')"
                        variant="outlined"
                        color="blue-grey"
                        class="ml-2 mt-2"
                    >
                        Закрыть
                    </VBtn>
                </VCardActions>
            </VForm>
        </VContainer>
    </VCard>
</template>

<script setup lang="ts">
    import type { VTextField } from "vuetify/lib/components/index.mjs";

    const props = defineProps({
        loading: {
            type: Boolean,
        },
        disabled: {
            type: Boolean,
        },
    });
    const emit = defineEmits<{
        close: [];
        addTag: [tag: Tag];
    }>();

    const valid = ref(false);
    const tagText = ref("");
    const rules = [
        (value: string) => {
            return value?.length > 0 || "Обязательно для заполнения";
        },
    ];

    const colors = useColors().value;
    const selectedColor = ref<Color>(colors[0]);
    function selectColor(color: Color) {
        selectedColor.value = color;
    }

    const input = ref<InstanceType<typeof VTextField> | null>(null);
    function onAddTag() {
        if (!valid.value) {
            return;
        }
        emit("addTag", {
            color: selectedColor.value,
            text: tagText.value,
        });
        input.value?.reset();
    }
</script>

<style scoped lang="scss">
    .add-tag {
        min-width: 300px;

        &__colors {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 8px;
        }

        &__color {
            transition: outline-color 0.2s, outline-offset 0.2s;
            outline-offset: 12px;
            outline: 2px solid transparent;
        }

        &__selected {
            outline-offset: 3px;
            outline-color: rgb(var(--v-theme-outline));
        }

        &__controls {
            display: flex;
            justify-content: flex-end;
        }
    }
</style>
