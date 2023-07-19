<template>
    <KeepAlive>
        <VCard class="add-tag">
            <VContainer>
                <VForm @submit.prevent="onSubmit" v-model="valid">
                    <div class="mb-2">Цвет</div>
                    <VItemGroup
                        selected-class="add-tag__selected"
                        mandatory="force"
                        class="add-tag__colors"
                    >
                        <template v-for="color in useColors().value">
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
                            :loading="loading"
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
    </KeepAlive>
</template>

<script setup lang="ts">
    const valid = ref(false);
    const loading = ref(false);

    const tagText = ref("");
    const selectedColor = ref("");

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

    const emit = defineEmits(["close"]);

    async function onSubmit() {
        if (!valid.value) {
            return;
        }

        loading.value = true;

        const tags = await new Promise((resolve) => {
            setTimeout(() => {
                resolve([{ color: "green", text: "green" }]);
            }, 5000);
        });

        loading.value = false;
        emit("close");
    }
</script>

<style lang="scss">
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
