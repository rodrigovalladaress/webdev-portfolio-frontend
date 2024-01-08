<template>
  <a
    class="card lowercase mono-font display-flex justify-content-center align-items-center text-medium border-white bg-black-a-90 p-1"
    href="#"
    @click="onCardClick"
  >
    Portfolio
  </a>

  <ProjectDialog :is-visible="isDialogVisible" :project="testProject" @closed="onDialogClosed"></ProjectDialog>
</template>

<script lang="ts" setup>
import type { Project } from "~/types/project";

const props = withDefaults(defineProps<{ isVisible?: boolean }>(), { isVisible: false });

const isDialogVisible = ref(!!props.isVisible);

const testProject: Project = {
  name: "Portfolio",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." +
    " Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure " +
    "dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non" +
    " proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  skills: [
    "Node.js",
    "HTML",
    "CSS",
    "React",
    "Vue",
    "SQL",
    "SCSS",
    "JavaScript",
    "TypeScript",
    "Express",
    "Three.js",
    "Python",
  ],
};

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
  }
}
</style>
