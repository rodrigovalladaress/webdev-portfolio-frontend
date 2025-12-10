/**
 * Stylelint config for this repo.
 * - Use postcss-html for Vue files so <style> blocks are parsed correctly.
 * - Use postcss-scss for SCSS files.
 */
module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-standard-vue/scss"],
  overrides: [
    {
      files: ["**/*.vue"],
      customSyntax: "postcss-html",
    },
  ],
  rules: {
    // Allow SCSS at-rules like @mixin, @include inside Vue/SCSS files
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "include",
          "mixin",
          "extend",
          "function",
          "return",
          "if",
          "else",
          "for",
          "each",
          "while",
          "use",
          "custom-media",
        ],
      },
    ],
    "scss/at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "include",
          "mixin",
          "extend",
          "function",
          "return",
          "if",
          "else",
          "for",
          "each",
          "while",
          "use",
          "custom-media",
        ],
      },
    ],
    "declaration-property-unit-allowed-list": {
      "/^border/": ["px"],
      "/^padding|^gap/": ["rem", "px"],
    },
    "unit-allowed-list": ["%", "deg", "px", "rem", "ms", "fr", "dvh", "dvw"],
    "no-empty-source": null,
    "no-unknown-custom-media": true,
  },
  ignoreFiles: ["node_modules/**", ".nuxt/**", "dist/**"],
};
