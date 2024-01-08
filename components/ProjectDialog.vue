<template>
  <dialog ref="dialog" class="bg-black text-color-regular">
    <div class="header d-flex justify-space-between">
      <h2 class="title h2 mono-font">{{ project.name }}</h2>

      <div class="close mono-font text-bold uppercase cursor-pointer" @click="onCloseClicked">x</div>
    </div>

    <ImageCarousel class="project-carousel" :inner-key="`${carouselKey}`" :is-enabled="isVisible"></ImageCarousel>

    <div class="description">
      {{ project.description }}
    </div>

    <template v-if="project.skills?.length">
      <h3 class="h3 mono-font lowercase skills">Skills</h3>

      <div class="tags d-flex wrap">
        <div v-for="(skill, key) in project.skills" :key="key" class="tag mono-font">{{ skill }}</div>
      </div>
    </template>
  </dialog>
</template>

<script lang="ts" setup>
import type { Project } from "~/types/project";

export type Props = {
  isVisible: boolean;
  project: Project;
};

const props = withDefaults(defineProps<Props>(), {
  isVisible: false,
});

const emit = defineEmits(["closed"]);

// Prop sent to the carousel to force the calculation of its
// step when the dialog is shown
const carouselKey = ref(0);
const dialog = ref<HTMLDialogElement | null>(null);

const show = () => {
  dialog.value?.showModal();
  carouselKey.value += 1;
};

const close = () => {
  dialog.value?.close();
};

const onCloseClicked = () => {
  if (!dialog.value) {
    return;
  }

  // dialog.value.close();
  close();
  emit("closed");
};

watch([props], () => {
  if (!dialog.value) {
    return;
  }

  const { isVisible } = props;

  if (isVisible) {
    show();
  } else {
    close();
  }
});
</script>

<style lang="scss" scope>
dialog {
  margin: 0;
  min-height: 100vh;
  min-width: 100vw;
  padding: 2rem;
  border: 2px solid $text-color;

  .close {
    $right-spacing: 0.4rem;
    $transition-duration: 250ms;

    height: fit-content;
    padding: 0.1rem $right-spacing 0.245rem 0.295rem;
    margin-right: -$right-spacing;
    color: $text-color;
    background-color: $bg-black;
    line-height: 1;
    transition:
      color $transition-duration ease-in-out,
      background-color $transition-duration ease-in-out;

    &:hover {
      color: $bg-black;
      background-color: $text-color;
    }
  }

  .project-carousel {
    margin-bottom: 2.8rem;
  }

  .title {
    margin-top: -0.4rem;
    margin-bottom: 3rem;
  }

  .description {
    font-size: 1.8rem;
    line-height: 1.167;
  }

  .skills {
    margin: 3rem 0 1rem;
  }

  .tags {
    gap: 1.3rem 1rem;
  }

  .tag {
    padding: 0.2rem 1rem;
    border: 1px solid $text-color;
    border-radius: 10px;
    font-size: 1.4rem;
  }
}
</style>
