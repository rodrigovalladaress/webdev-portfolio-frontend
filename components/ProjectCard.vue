<template>
  <NuxtLink class="card" :to="`/projects?id=${project.id}`">
    <div class="name">
      {{ project.name }}
    </div>
  </NuxtLink>

  <ProjectDialog :is-visible="isDialogVisible" :project="project"></ProjectDialog>
</template>

<script lang="ts" setup>
import type { Project } from "~/types/project";

withDefaults(defineProps<{ project: Project; isDialogVisible: boolean }>(), {
  project: () => ({ id: "", name: "", description: "", type: "client" }),
  isDialogVisible: false,
});
</script>

<style lang="scss" scoped>
.card {
  display: grid;
  place-content: center;
  font-size: var(--t-h5);
  font-family: var(--font-mono);
  text-transform: lowercase;
  border: 1px white solid;
  min-height: 14rem;
  padding: var(--spacing-1);

  @media (--lg) {
    font-size: var(--t-h4);
    min-height: 18rem;
  }
}

a.card {
  --transition-duration: 200ms;

  color: var(--color-primary);
  background-color: oklch(var(--color-bg-black-value) / 80%);
  transform: scale(1);
  text-align: center;
  z-index: 0;
  will-change: transform;

  @media (--lg) {
    transition:
      color var(--transition-duration) ease-in-out,
      background-color 400ms ease-in-out,
      outline-color var(--transition-duration) ease-in-out,
      transform var(--transition-duration) ease-in-out;

    &:hover,
    &:active {
      --color-background: oklch(var(--color-primary-l) calc(var(--color-primary-c) * 0.8) var(--color-primary-h));

      color: var(--color-bg-black);
      background-color: var(--color-background);
      border-color: var(--color-background);
      transform: scale(1.06);
      z-index: 1;
    }

    &:active {
      transform: scale(1.04);
    }
  }
}
</style>
