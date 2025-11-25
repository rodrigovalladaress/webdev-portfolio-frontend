<template>
  <div class="home-wrapper">
    <div class="title-wrapper">
      <h2 class="title">
        <span aria-hidden>/</span>Full-stack <br> /frontend developer
      </h2>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: "Home",
  order: 0,
});
</script>

<style lang="scss" scoped>
.home-wrapper {
  display: flex;
  min-height: 100%;
  align-items: flex-end;
}

.title-wrapper {
  width: fit-content;
  padding: var(--s-1-px);
  background-color: oklch(var(--color-bg-black-value) / 70%);
  backdrop-filter: blur(2px);
}

.title {
  font-size: var(--t-h1);
  text-transform: lowercase;
  font-family: var(--mono-font);
}
</style>
