// eslint-disable-next-line import/no-named-as-default
import glslify from "vite-plugin-glslify";
import svgLoader from "vite-svg-loader";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  modules: ["@nuxtjs/eslint-module", "@nuxtjs/google-fonts", "nuxt-purgecss", "nuxt-beastcss"],
  devtools: { enabled: true },
  app: {
    head: {
      title: "Rodrigo | London based full-stack developer",
      meta: [
        {
          name: "description",
          content: "Porfolio website for Rodrigo Valladares Santana, London based full-stack developer",
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
  css: [
    '~/assets/main.css'
  ],
  vite: {
    define: {
      __VUE_PROD_DEVTOOLS__: true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use 'sass:math';
            @use "@/assets/_inject-breakpoints.scss" as *;
            @use "@/assets/_fixes.scss" as *;
            @use "@/assets/_dialog-layout-shift-fix.scss" as *;
            @use "@/assets/_mixins.scss" as *;
            @use "@/assets/_colors.scss" as *;
            @use "@/assets/_variables.scss" as *;
            @use "@/assets/_classes.scss" as *;`,
        },
      },
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
  purgecss: {
    enabled: true,
    safelist: ["svg", "img", "button"],
  },
});
