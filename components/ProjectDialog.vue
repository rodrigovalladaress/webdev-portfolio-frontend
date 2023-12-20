<template>
  <dialog ref="dialog" class="bg-black text-color-regular">
    <div class="header d-flex justify-space-between">
      <div class="title h2 mono">{{ project.name }}</div>

      <div @click="onCloseClicked">x</div>
    </div>

    <ImageCarousel class="project-carousel" :inner-key="`${carouselKey}`"></ImageCarousel>

    <div class="description">
      {{ project.description }}
    </div>
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

<style lang="scss" scopes>
dialog {
  margin: 0;
  min-height: 100vh;
  min-width: 100vw;
  padding: 2rem;
  border: 2px solid $text-color;

  .project-carousel {
    margin-bottom: 2.8rem;
  }

  .title {
    margin-top: -0.4rem;
    margin-bottom: 3rem;
  }
}
</style>
