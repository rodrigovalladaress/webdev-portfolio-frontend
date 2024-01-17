<template>
  <NuxtLink
    class="card lowercase mono-font display-flex justify-content-center align-items-center text-medium outline-white bg-black-a-90 p-1"
    :to="`/projects?id=${project.id}`"
  >
    <div class="name">
      {{ project.name }}
    </div>
  </NuxtLink>
  <ProjectDialog :is-visible="isDialogVisible" :project="project"></ProjectDialog>
</template>

<script lang="ts" setup>
import type { Project } from "~/types/project";

withDefaults(defineProps<{ project: Project; isDialogVisible: boolean }>(), {
  project: () => ({ id: "", name: "", description: "" }),
  isDialogVisible: false,
});
</script>

<style lang="scss" scoped>
@use "sass:color";

.card {
  font-size: 3.2rem;
  display: flex;
}

a.card {
  $transition-duration: 200ms;

  color: $primary;
  background-color: $bg-black-a-90;
  transform: scale(1);
  text-align: center;
  z-index: 0;

  @include media(lg) {
    transition:
      color $transition-duration ease-in-out,
      background-color 400ms ease-in-out,
      outline $transition-duration ease-in-out,
      transform $transition-duration ease-in-out;

    &:hover,
    &:active,
    &:focus {
      color: color.change($bg-black, $lightness: 10%);
      background-color: color.change($primary, $saturation: 80%);
      outline: color.change($primary, $alpha: 0.95);
      transform: scale(1.06);
      z-index: 1;
    }

    &:active {
      color: $bg-black;
      background-color: color.change($primary, $saturation: 100%);
      transform: scale(1.04);
    }

    .name {
      max-width: 28.8rem;
    }
  }
}
</style>
