<template>
  <a
    class="card lowercase mono-font display-flex justify-content-center align-items-center text-medium border-white bg-black-a-90 p-1"
    href="#"
    @click="onCardClick"
  >
    <div class="name">
      {{ project.name }}
    </div>
  </a>

  <ProjectDialog :is-visible="isDialogVisible" :project="project" @closed="onDialogClosed"></ProjectDialog>
</template>

<script lang="ts" setup>
import type { Project } from "~/types/project";

const props = withDefaults(defineProps<{ project: Project; isVisible?: boolean }>(), { isVisible: false });

const isDialogVisible = ref(!!props.isVisible);

const onCardClick = () => (isDialogVisible.value = !isDialogVisible.value);
const onDialogClosed = () => {
  isDialogVisible.value = false;
  // Prevent that the card that opened the dialog becomes focused after
  // closing the dialog
  (document.activeElement as HTMLElement)?.blur();
};
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
