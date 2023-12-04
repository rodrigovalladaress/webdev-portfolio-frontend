<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss">
html {
  font-family: Roboto, Arial, Helvetica, sans-serif;
}

h1 {
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
