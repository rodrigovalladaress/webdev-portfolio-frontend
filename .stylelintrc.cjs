/**
 * Stylelint config for this repo.
 * - Use postcss-html for Vue files so <style> blocks are parsed correctly.
 * - Use postcss-scss for SCSS files.
 */
module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-standard-vue'
  ],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html'
    },
    {
      files: ['**/*.{scss,sass}'],
      customSyntax: 'postcss-scss'
    }
  ],
  rules: {
    // Allow SCSS at-rules like @mixin, @include inside Vue/SCSS files
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true
  },
  ignoreFiles: ['node_modules/**', '.nuxt/**', 'dist/**']
};
