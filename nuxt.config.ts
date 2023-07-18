// import vuetify from "vite-plugin-vuetify";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // devtools: { enabled: true },
    // postcss: {
    //     plugins: {
    //         tailwindcss: {},
    //         autoprefixer: {},
    //     },
    // },
    // build: {
    //     transpile: ["vuetify"],
    // },
    // vite: {
    //     // ssr: {
    //     //     noExternal: ["vuetify"],
    //     // },
    //     plugins: [vuetify()],
    // },
    modules: ["@invictus.codes/nuxt-vuetify"],
    // modules: [
    //     async (options, nuxt) => {
    //         nuxt.hooks.hook("vite:extendConfig", (config) => {
    //             config.plugins?.push(vuetify());
    //         });
    //     },
    // ],
});
