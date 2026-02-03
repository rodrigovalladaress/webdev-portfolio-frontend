<template>
  <div class="button-group">
    <!-- TODO Use CSS variables instead of getting the color value -->
    <button
      v-for="color in COLOR_KEYS"
      :key="color"
      class="color-button"
      :style="getButtonStyle(color)"
      @click="changePrimaryColor(color)"
    >
      {{ color }}
    </button>
  </div>
</template>

<script lang="ts" setup>
function getColorValue(color: keyof typeof COLORS) {
  const { l, c, h } = COLORS[color];
  return `oklch(${l} ${c} ${h})`;
}

function getButtonStyle(color: keyof typeof COLORS) {
  const style: Record<string, string> = {
    backgroundColor: getColorValue(color),
  };

  return style;
}
</script>

<style lang="scss" scoped>
.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.color-button {
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-family: var(--font-mono, monospace);
  transition: opacity 0.2s;
}

.color-button:hover {
  opacity: 0.8;
}
</style>
