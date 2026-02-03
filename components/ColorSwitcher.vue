<template>
  <div class="button-group">
    <button
      v-for="color in COLOR_KEYS"
      :key="color"
      class="color-button"
      :class="{ ['is-selected']: selectedColor === color }"
      :style="{
        ['--background-color-l']: getBackgroundColor(color).l,
        ['--background-color-c']: getBackgroundColor(color).c,
        ['--background-color-h']: getBackgroundColor(color).h,
      }"
      aria-hidden
      @click="onButtonClicked(color)"
    >
      <span>
        <div class="outer-border">
          <div class="inner-border"></div>
        </div>
      </span>
    </button>
  </div>
</template>

<script lang="ts" setup>
const selectedColor = ref<ColorKey>("green");

function getBackgroundColor(color: ColorKey) {
  return COLORS[color];
}

function onButtonClicked(color: ColorKey) {
  selectedColor.value = color;
  changePrimaryColor(color);
}
</script>

<style lang="scss" scoped>
.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.color-button {
  will-change: transform;
  transform-origin: 100% 100%;
  transition:
    background-color 400ms ease-in,
    transform 400ms ease-in;
  background-color: oklch(var(--background-color-l) var(--background-color-c) var(--background-color-h));
  transform: scale(1);
  flex-basis: 1;
  flex-shrink: 0;
  flex-grow: 1;
  aspect-ratio: 1 / 1;
  padding: 0;
  position: relative;
  overflow: hidden;

  @media (--lg) {
    width: 64px;
  }

  &:not(.is-selected) {
    cursor: pointer;

    &:active,
    &:hover {
      transform: scale(1.06);
      background-color: oklch(
        calc(var(--background-color-l) * 1.2) calc(var(--background-color-c) * 1.5) var(--background-color-h)
      );
      transition:
        background-color 300ms ease-out,
        transform 300ms ease-out;
    }
  }

  .outer-border,
  .inner-border {
    width: 100%;
    height: 100%;
    transform: scale(1.2);
    left: 0;
    top: 0;
    position: absolute;
    transform-origin: 50% 50%;
    transition: transform 600ms ease-out;
  }

  .outer-border {
    border: var(--border-width) solid transparent;
  }

  .inner-border {
    border: var(--border-width) solid transparent;
  }

  &.is-selected {
    transform: scale(1);
    transition:
      background-color 150ms ease-in,
      transform 150ms ease-in;

    .outer-border,
    .inner-border {
      transform: scale(1);
    }

    .outer-border {
      border-color: white;
    }

    .inner-border {
      border-color: black;
    }
  }
}

.is-selected {
  --border-width: 4px;

  .outer-border,
  .inner-border {
    width: 100%;
    height: 100%;
  }

  .outer-border {
    border: var(--border-width) solid white;
  }

  .inner-border {
    border: var(--border-width) solid black;
  }
}
</style>
