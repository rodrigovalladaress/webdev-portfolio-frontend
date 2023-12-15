<template>
  <dialog ref="dialog">
    <div class="header d-flex justify-space-between">
      <div class="title">{{ project.name }}</div>

      <div @click="onClose">x</div>
    </div>

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

const dialog = ref<HTMLDialogElement | null>(null);

const onClose = () => {
  if (!dialog.value) {
    return;
  }

  dialog.value.close();
  emit("closed");
};

watch([props], () => {
  if (!dialog.value) {
    return;
  }

  const { isVisible } = props;

  if (isVisible) {
    dialog.value.showModal();
  } else {
    dialog.value.close();
  }
});
</script>

<style lang="scss"></style>
