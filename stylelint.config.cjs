module.exports = {
  extends: "stylelint-config-standard-vue",
  overrides: [
    {
      files: ["**/*.vue"],
      customSyntax: "postcss-html",
    },
  ],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["custom-media"],
      },
    ],
    "declaration-property-unit-allowed-list": {
      "/^border/": ["px"],
      "/^padding|^gap/": ["rem", "px"],
    },
    "unit-allowed-list": ["%", "deg", "px", "rem", "ms", "fr", "dvh", "dvw"],
    "no-empty-source": null,
  },
  ignoreFiles: ["node_modules/**", ".nuxt/**", "dist/**"],
};
