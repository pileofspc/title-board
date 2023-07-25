<template>
    <VCard class="add-tag">
        <VContainer>
            <VForm @submit.prevent="" v-model="valid">
                <div class="mb-2">Цвет</div>
                <VItemGroup
                    selected-class="add-tag__selected"
                    mandatory="force"
                    class="add-tag__colors"
                >
                    <template v-for="color in colors">
                        <VItem
                            v-slot="{ selectedClass, select }"
                            @group:selected="selectedColor = color"
                        >
                            <VBtn
                                density="compact"
                                :color="color"
                                @click="select"
                                :class="selectedClass"
                                class="add-tag__color"
                            />
                        </VItem>
                    </template>
                </VItemGroup>

                <div class="mt-4">Текст</div>
                <VTextField
                    v-model="tagText"
                    :rules="rules"
                    :counter="max"
                    density="compact"
                />
                <div class="add-tag__controls">
                    <VBtn
                        type="submit"
                        color="blue-grey"
                        class="mt-2"
                        :loading="props.loading"
                        :disabled="props.disabled"
                        @click="onAddTag"
                    >
                        Добавить
                    </VBtn>
                    <VBtn
                        variant="outlined"
                        color="blue-grey"
                        class="ml-2 mt-2"
                        @click="emit('close')"
                    >
                        Закрыть
                    </VBtn>
                </div>
            </VForm>
        </VContainer>
    </VCard>
</template>

<script setup lang="ts">
    import { v4 as uuidv4 } from "uuid";

    const colors = useColors().value;

    const valid = ref(false);
    const tagText = ref("");
    const selectedColor = ref<Color>(colors[0]);

    const max = 150;
    const rules = [
        (value: string) => {
            if (value) return true;
            return "Обязательно для заполнения";
        },
        (value: string) => {
            if (value?.length <= max) return true;
            return `Не более ${max} знаков`;
        },
    ];

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
        addTag: [Tag];
    }>();

    function onAddTag() {
        if (!valid.value) {
            return;
        }

        emit("addTag", {
            id: uuidv4(),
            color: selectedColor.value,
            text: tagText.value,
        });
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
