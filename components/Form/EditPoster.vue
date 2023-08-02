<template>
    <VCard class="edit-poster">
        <VCardTitle>Редактирование постера</VCardTitle>
        <VContainer>
            <VForm ref="formElement" @submit.prevent="onSubmit" v-model="valid">
                <VTextField
                    v-model="extLink"
                    clearable
                    @click:clear="extLink = ''"
                    :rules="[rules.link]"
                    label="Внешняя ссылка"
                    prepend-icon="mdi-open-in-new"
                    density="compact"
                />

                <div class="edit-poster__image px-4 pt-5 rounded-lg">
                    <VTextField
                        v-model="imgLink"
                        clearable
                        :disabled="
                            !(state === states.link || state === states.initial)
                        "
                        @click:clear="imgLink = ''"
                        :rules="[rules.link]"
                        label="Ссылка на изображение постера"
                        prepend-icon="mdi-image"
                        density="compact"
                    />

                    <div class="mb-4">ИЛИ</div>

                    <VFileInput
                        v-model="files"
                        clearable
                        :disabled="
                            !(state === states.file || state === states.initial)
                        "
                        accept="image/*"
                        label="Загрузите изображение"
                        show-size
                        :rules="[rules.image, rules.size]"
                        density="compact"
                    />
                </div>

                <PosterPosition
                    v-model="posterPos"
                    :src="fileURL || imgLink || props.poster?.img"
                    class="edit-poster__poster mt-6"
                />

                <VCardActions class="justify-end">
                    <VBtn
                        type="submit"
                        :loading="props.loading"
                        color="blue-grey"
                        variant="elevated"
                        class="mt-2"
                    >
                        Применить
                    </VBtn>
                    <VBtn
                        variant="outlined"
                        color="blue-grey"
                        class="ml-2 mt-2"
                        @click="emit('close')"
                    >
                        Закрыть
                    </VBtn>
                </VCardActions>
            </VForm>
        </VContainer>
    </VCard>
</template>

<script setup lang="ts">
    import type { VForm } from "vuetify/lib/components/index.mjs";

    const props = defineProps<{
        loading?: boolean;
        poster?: TitlePoster;
    }>();
    const emit = defineEmits<{
        close: [];
        editPoster: [poster: TitlePoster];
    }>();

    const states = {
        link: "LINK",
        file: "FILE",
        initial: "INITIAL",
    } as const;

    const valid = ref(false);
    const extLink = ref(props.poster?.link || "");
    const imgLink = ref(props.poster?.img || "");
    const files = shallowRef<File[]>([]);
    const file = computed(() => files.value?.[0]);
    const fileURL = computed(() => {
        return !imgLink.value && file.value
            ? URL.createObjectURL(file.value)
            : null;
    });

    const state = computed(() => {
        if (imgLink.value?.length > 0) {
            return states.link;
        }
        if (file.value) {
            return states.file;
        }
        return states.initial;
    });

    const regexp =
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    const rules = {
        required: (value: unknown) => !!value,
        link: (value: string) =>
            !value ||
            regexp.test(value) ||
            "Пожалуйста, введите ссылку правильно",
        image: (value: File[]) =>
            !value?.[0] ||
            value?.[0]?.type.startsWith("image") ||
            "Файл должен быть изображением",
        size: (value: File[]) =>
            !value?.[0] ||
            value[0].size < 50000000 ||
            "Размер файла не должен превышать 50 МБ",
    };

    const formElement = ref<InstanceType<typeof VForm> | null>(null);

    function prefix(link: string) {
        const prefix = "https://";
        return link.startsWith(prefix) ? link : prefix.concat(link);
    }

    function onSubmit() {
        if (!formElement.value?.isValid) {
            return;
        }

        const poster: TitlePosterBlob = {};
        extLink.value?.length > 0 && (poster.link = prefix(extLink.value));
        imgLink.value?.length > 0 && (poster.img = prefix(imgLink.value));
        file.value && (poster.imgBlob = file.value);
        emit("editPoster", poster);
    }

    const posterPos = ref<Position>({
        x: 50,
        y: 50,
    });
</script>

<style scoped lang="scss">
    .edit-poster {
        min-width: 300px;

        &__image {
            border: 1px solid grey;
        }

        &__poster {
            max-width: 584px;
        }
    }
</style>
