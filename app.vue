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

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 550ms;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(70%) scale(90%);
  overflow-x: hidden;
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-70%) scale(90%);
  overflow-x: hidden;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-70%) scale(90%);
  overflow-x: hidden;
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(70%) scale(90%);
  overflow-x: hidden;
}
</style>
