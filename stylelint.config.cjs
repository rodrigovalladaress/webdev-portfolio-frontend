/**
 * Stylelint config for this repo.
 * - Use postcss-html for Vue files so <style> blocks are parsed correctly.
 * - Use postcss-scss for SCSS files.
 */
module.exports = {
  extends: ["stylelint-config-standard-scss", "stylelint-config-standard-vue/scss"],
  overrides: [
    {
      files: ["**/*.vue"],
      customSyntax: "postcss-html",
    },
    {
      files: ["**/*.{scss,sass}"],
      customSyntax: "postcss-scss",
    },
  ],
  rules: {
    // Allow SCSS at-rules like @mixin, @include inside Vue/SCSS files
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["include", "mixin", "extend", "function", "return", "if", "else", "for", "each", "while"],
      },
    ],
    "scss/at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["include", "mixin", "extend", "function", "return", "if", "else", "for", "each", "while"],
      },
    ],
    "declaration-property-unit-allowed-list": {
      "/^border/": ["px"],
      "/^padding|^gap/": ["rem"],
    },
    "unit-allowed-list": ["%", "deg", "px", "rem", "ms", "fr", "vh", "vw"],
    "no-empty-source": null,
  },
  ignoreFiles: ["node_modules/**", ".nuxt/**", "dist/**"],
};
