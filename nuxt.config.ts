// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // devtools: { enabled: true },
    // postcss: {
    //     plugins: {
    //         tailwindcss: {},
    //         autoprefixer: {},
    //     },
    // },
    modules: ["@invictus.codes/nuxt-vuetify", "@pinia/nuxt"],
    pinia: {
        autoImports: ["defineStore"],
    },
    imports: {
        dirs: ["stores"],
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
    typescript: {
        strict: true,
    },
});
