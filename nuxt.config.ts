// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        "@invictus.codes/nuxt-vuetify",
        "@pinia/nuxt",
        "nuxt-typed-router",
    ],

    pinia: {
        autoImports: ["defineStore", "storeToRefs"],
    },

    imports: {
        dirs: ["./stores"],
    },

    nitro: {
        esbuild: {
            options: {
                tsconfigRaw: {
                    compilerOptions: {
                        experimentalDecorators: true,
                    },
                },
            },
        },
    },

    vuetify: {
        vuetifyOptions: {
            theme: {
                variations: {
                    colors: ["primary"],
                    lighten: 5,
                    darken: 5,
                },
                defaultTheme: "myTheme",
                themes: {
                    myTheme: {
                        dark: false,
                        colors: {
                            primary: "#3F51B5",
                            outline: "#668290",
                        },
                    },
                },
            },
        },
        moduleOptions: {
            useIconCDN: false,
        },
    },

    devtools: {
        enabled: false,
    },
});
