<template>
  <canvas id="three"></canvas>

  <ThreeJs></ThreeJs>

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
#three {
  position: fixed;
  inset: 0;

  // top: 0;
  // left: 0;

  outline: none;
}
</style>

<style lang="scss">
body {
  background-color: green;
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
