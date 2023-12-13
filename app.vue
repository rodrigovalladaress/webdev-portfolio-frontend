<template>
  <canvas id="three"></canvas>
  <div class="three overlay" :class="{ loading: isThreeLoading, loaded: !isThreeLoading }"></div>

  <ThreeJs @loaded="onThreeLoaded"></ThreeJs>

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
const isThreeLoading = ref(true);

const onThreeLoaded = () => {
  isThreeLoading.value = false;
};
</script>

<style lang="scss" scoped>
#three {
  position: fixed;
  inset: 0;
  outline: none;
  z-index: -2;
}

.overlay {
  position: absolute;
  inset: 0;
  z-index: -1;
  transition: background-color 600ms ease-in-out;
  pointer-events: none;

  &.loading {
    background-color: black;
  }

  &.loaded {
    background-color: transparent;
  }
}
</style>

<style lang="scss">
body {
  background-color: black;
}

.page-enter-active,
.page-leave-active {
  transition: all 400ms;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

.rotate-enter-active,
.rotate-leave-active {
  transition: all 400ms;
}

.rotate-enter-from,
.rotate-leave-to {
  opacity: 0;
  transform: rotate3d(1, 1, 1, 15deg);
}
</style>
