<template>
  <div class="home-wrapper">
    <div class="title-wrapper">
      <h2 class="title">
        <span aria-hidden>/</span>Full-stack <br />
        /front-end developer
      </h2>
    </div>
    <ColorSwitcher />
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
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  gap: var(--spacing-1, 1rem);
}

.title-wrapper {
  width: fit-content;
  padding: var(--spacing-1);
  background-color: oklch(var(--color-bg-black-value) / 70%);
  backdrop-filter: blur(2px);
}

.title {
  font-size: var(--t-h2);
  text-transform: lowercase;
  font-family: var(--font-mono);
}
</style>
