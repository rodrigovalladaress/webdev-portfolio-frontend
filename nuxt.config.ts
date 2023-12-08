// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    // Simple usage
    "@nuxtjs/eslint-module",
    "@nuxtjs/stylelint-module",
    "@nuxtjs/google-fonts",
    "@nuxtjs/apollo",
  ],
  devtools: { enabled: true },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  typescript: {
    shim: false,
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use 'sass:math';
            @use "@/assets/_fixes.scss" as *;
            @use "@/assets/_mixins.scss" as *;
            @use "@/assets/_colors.scss" as *;
            @use "@/assets/_variables.scss" as *;
            @use "@/assets/_classes.scss" as *;`,
        },
      },
    },
  },
  googleFonts: {
    display: "swap",
    families: {
      Roboto: true,
      "Roboto+Mono": true,
    },
  },
  apollo: {
    clients: {
      default: {
        httpEndpoint: process.env.APOLLO_HTTP_ENDPOINT || "http://localhost:1338/graphql",
      },
    },
  },
});
