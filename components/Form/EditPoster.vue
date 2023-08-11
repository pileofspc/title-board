<template>
    <VCard class="edit-poster">
        <VCardTitle>Редактирование постера</VCardTitle>
        <VContainer class="pt-1">
            <VForm @submit.prevent="onSubmit" v-model="isMainValid">
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
                    <VForm v-model="isImgLinkValid">
                        <VTextField
                            v-model="imgLink"
                            :disabled="isImgLinkDisabled"
                            validate-on="input"
                            clearable
                            @click:clear="imgLink = ''"
                            :append-inner-icon="
                                props.poster?.img &&
                                props.poster?.img !== imgLink
                                    ? 'mdi-undo'
                                    : null
                            "
                            @click:append-inner="
                                imgLink = props.poster?.img || ''
                            "
                            :rules="[rules.link]"
                            label="Ссылка на изображение постера"
                            prepend-icon="mdi-image"
                            density="compact"
                        />
                    </VForm>

                    <div class="mb-4">ИЛИ</div>

                    <VFileInput
                        v-model="files"
                        clearable
                        accept="image/*"
                        label="Загрузите изображение"
                        show-size
                        :rules="[rules.image, rules.size]"
                        density="compact"
                    />
                </div>

                <VCardTitle>Выберите отображаемую часть изображения</VCardTitle>
                <PosterPosition
                    :position="posterPos"
                    @update-position="updatePos"
                    :src="previewSrc"
                    class="edit-poster__poster"
                />

                <VCardActions class="justify-end">
                    <VBtn
                        type="submit"
                        :disabled="props.disabled"
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
    const props = defineProps<{
        disabled?: boolean;
        poster?: TitlePoster;
    }>();
    const emit = defineEmits<{
        close: [];
        editPoster: [poster: TitlePoster];
    }>();

    const imgLink = ref(props.poster?.img || "");
    const isImgLinkDisabled = computed(() => !!file.value);

    const extLink = ref(props.poster?.link || "");

    const files = shallowRef<File[]>([]);
    const file = computed(() => files.value[0]);
    const fileURL = ref("");
    watch(file, (val) => {
        URL.revokeObjectURL(fileURL.value);
        if (val) {
            fileURL.value = URL.createObjectURL(val);
        } else {
            fileURL.value = "";
        }
    });

    const posterPos = ref<Position>(
        props.poster?.position ? { ...props.poster.position } : { x: 50, y: 50 }
    );
    function updatePos(x: number, y: number) {
        posterPos.value.x = x;
        posterPos.value.y = y;
    }

    const validatedImgLinkSrc = ref(props.poster?.img || "");
    watch(
        imgLink,
        timeout(() => {
            if (isImgLinkValid.value) {
                validatedImgLinkSrc.value = prefix(imgLink.value);
            } else {
                validatedImgLinkSrc.value = "";
            }
        }, 400)
    );
    const previewSrc = computed(() => {
        return fileURL.value || validatedImgLinkSrc.value;
    });
    // Когда ссылка становится равна той, что уже была установлена - позиция тоже возвращается на исходную
    watch(previewSrc, (val) => {
        if (val === props.poster?.img && props.poster.position) {
            posterPos.value = { ...props.poster.position };
            return;
        }
        posterPos.value.x = 50;
        posterPos.value.y = 50;
    });

    const isImgLinkValid = ref(false);
    const isMainValid = ref(false);
    const isEverythingValid = computed(() => {
        return (
            isMainValid.value &&
            (isImgLinkDisabled.value || isImgLinkValid.value)
        );
    });

    const regexp =
        /^data|^blob|[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&/=]*)/;
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

    // helper
    // TODO: на прод переделать нормально
    function prefix(link: string) {
        const prefixes = ["data:", "blob:", "file:", "https://"];
        for (const prefix of prefixes) {
            if (link.startsWith(prefix) || link === "") {
                return link;
            }
        }
        return "https://".concat(link);
    }

    async function onSubmit() {
        if (!isEverythingValid.value) {
            return;
        }

        const poster: TitlePosterBlob = {};
        poster.position = posterPos.value;
        if (extLink.value?.length > 0) {
            poster.link = prefix(extLink.value);
        }
        if (file.value) {
            poster.imgFileBase64 = await blobToBase64(file.value);
        } else if (imgLink.value.length > 0) {
            poster.img = prefix(imgLink.value);
        }
        emit("editPoster", poster);
        emit("close");
    }
</script>

<style scoped lang="scss">
    .edit-poster {
        min-width: 300px;

        &__image {
            border: 1px solid grey;
        }

        &__poster {
            margin-inline: auto;
            max-width: 584px;
        }
    }
</style>
