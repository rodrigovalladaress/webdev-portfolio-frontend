// eslint-disable-next-line import/no-named-as-default
import glslify from "vite-plugin-glslify";
import svgLoader from "vite-svg-loader";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  modules: ["@nuxtjs/eslint-module", "@nuxtjs/google-fonts"],
  devtools: { enabled: true },
  app: {
    head: {
      title: "Rodrigo | full-stack/front-end developer",
      meta: [
        {
          name: "description",
          content: "Porfolio website for Rodrigo Valladares Santana, full-stack/front-end developer",
        },
      ],
    },
    pageTransition: { name: "slide-left", mode: "out-in" },
  },
  nitro: {
    compressPublicAssets: { gzip: true, brotli: true },
    preset: "netlify-static",
    static: true,
  },
  typescript: {
    shim: false,
  },
  css: ["~/assets/main.css"],
  postcss: {
    plugins: {
      "@csstools/postcss-global-data": {
        files: ["assets/main.css"],
      },
      "postcss-nested": {},
      "postcss-custom-media": {},
    },
  },
  vite: {
    define: {
      __VUE_PROD_DEVTOOLS__: true,
    },
    plugins: [glslify(), svgLoader()],
  },
  googleFonts: {
    display: "swap",
    useStylesheet: true,
    // Don't download the fonts locally so they work on Netlify
    download: false,
    families: {
      Roboto: true,
      "Roboto+Mono": true,
    },
  },
  runtimeConfig: {
    public: {
      web3FormsKey: "5d398354-082e-4158-81ef-a3dc11e41fe7",
      linkedin: "https://www.linkedin.com/in/rodrigo-valladares-santana/",
    },
  },
});
