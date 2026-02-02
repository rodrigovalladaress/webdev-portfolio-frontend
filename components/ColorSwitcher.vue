<template>
  <div class="button-group">
    <button
      v-for="color in colorKeys"
      :key="color"
      class="color-button"
      :style="getButtonStyle(color)"
      @click="changeColor(color)"
    >
      {{ capitalize(color) }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { injectCssVariable } from "~/utils/css";

const colors = {
  red: { l: "62.8%", c: "0.25768", h: "29.234deg" },
  blue: { l: "67.5%", c: "0.25", h: "264deg" },
  yellow: { l: "90%", c: "0.19", h: "100deg" },
  pink: { l: "75%", c: "0.22", h: "350deg" },
  purple: { l: "60%", c: "0.25", h: "310deg" },
  turquoise: { l: "75%", c: "0.15", h: "200deg" },
  green: { l: "86.645%", c: "0.2948", h: "142.511deg" },
};

const colorKeys = Object.keys(colors) as Array<keyof typeof colors>;

function changeColor(color: keyof typeof colors) {
  const { l, c, h } = colors[color];
  injectCssVariable("--color-primary-l", l);
  injectCssVariable("--color-primary-c", c);
  injectCssVariable("--color-primary-h", h);
}

function getColorValue(color: keyof typeof colors) {
  const { l, c, h } = colors[color];
  return `oklch(${l} ${c} ${h})`;
}

function getButtonStyle(color: keyof typeof colors) {
  const style: Record<string, string> = {
    backgroundColor: getColorValue(color),
  };

  // Add black text for light colors
  if (color === "yellow") {
    style.color = "#000";
  }

  return style;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
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
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-family: var(--font-mono, monospace);
  transition: opacity 0.2s;
}

.color-button:hover {
  opacity: 0.8;
}
</style>
