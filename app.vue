<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup></script>

<style lang="scss">
// TODO move some of this to a different file
:root {
  // So 10px = 1rem
  font-size: 62.5%;
}

body {
  box-sizing: border-box;
  font-family: Roboto, Arial, Helvetica, sans-serif;
  font-size: 1.6rem;
  background-color: black;
  color: $text-color;
  padding: 0;
  margin: 0;
}

// https://css-tricks.com/inheriting-box-sizing-probably-slightly-better-best-practice/
*,
*::before,
*::after {
  box-sizing: inherit;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
  color: $text-color;
  font-weight: 400;
}

h1,
.h1 {
  font-family: "Roboto Mono", Arial, Helvetica, sans-serif;
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
