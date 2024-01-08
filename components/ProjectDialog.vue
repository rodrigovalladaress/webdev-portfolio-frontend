<template>
  <dialog
    ref="dialog"
    class="d-flex column justify-content-center align-items-center bg-trans"
    :class="{ opened: isVisible, closed: !isVisible }"
  >
    <div class="backdrop bg-black-a-90"></div>

    <div class="content text-color-regular">
      <div class="header d-flex justify-space-between">
        <h2 class="title h2 mono-font">{{ project.name }}</h2>

        <div class="close-btn mono-font text-bold uppercase cursor-pointer" @click="onCloseClicked">x</div>
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

const updateVisibility = () => {
  if (!dialog.value) {
    return;
  }

  const { isVisible } = props;

  if (isVisible) {
    show();
  } else {
    close();
  }
};

const show = () => {
  dialog.value?.showModal();
  carouselKey.value += 1;
};

const close = () => {
  dialog.value?.close("dismiss");
};

const onCloseClicked = () => {
  if (!dialog.value) {
    return;
  }

  close();
  emit("closed");
};

onMounted(() => {
  updateVisibility();
});

watch([props, dialog], () => {
  updateVisibility();
});
</script>

<style lang="scss" scope>
dialog {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  min-width: 100vw;

  .backdrop {
    position: absolute;
    inset: 0;
    z-index: -1;
    backdrop-filter: blur(3px);
  }

  .content {
    width: 100%;
    flex-grow: 1;
    border: 2px solid $text-color;
    padding: 2rem;
    transition: opacity 100ms ease-in-out;

    @include media(md) {
      flex-grow: 0;
      max-width: 608px;
    }
  }

  .close-btn {
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

$open-animation-duration: 1000ms;

// Animate the dialog
// https://codepen.io/fmontes/pen/yLveywJ
// Opened dialog
dialog[open] {
  .backdrop {
    animation: show-backdrop $open-animation-duration ease-in-out normal;
  }

  .content {
    animation: show-dialog $open-animation-duration ease-in-out normal;
  }

  // Play the animation on the children of content so the border is visible
  // from the beginning of the animation
  .content > * {
    animation: show-content $open-animation-duration ease-in-out normal;
  }
}

// Closed dialog
dialog:not([open]) {
  pointer-events: none;
  animation: hide 500ms forwards;

  // .backdrop {
  //   background-color: transparent;
  //   backdrop-filter: blur(0);
  //   animation: show-backdrop $open-animation-duration ease-in-out reverse;
  // }

  // .content {
  //   opacity: 0;
  //   transform: translateY(-100%) scale(0%);
  //   animation: translate-dialog $open-animation-duration ease-in-out reverse;
  // }

  // // Play the animation on the children of content so the border is visible
  // // from the beginning of the animation
  // .content > * {
  //   opacity: 0;
  //   animation: show-content-children $open-animation-duration ease-in-out reverse;
  // }
}

@keyframes show-dialog {
  0% {
    transform: translateY(-75%) scale(50%);
  }

  33% {
    transform: translateY(-75%) scale(50%);
  }

  34% {
    transform: translateY(-37.5%) scale(75%);
  }

  66% {
    transform: translateY(-37.5%) scale(75%);
  }

  67% {
    transform: translateY(0%) scale(100%);
  }

  100% {
    transform: translateY(0%) scale(100%);
  }
}

@keyframes show-backdrop {
  0% {
    background-color: transparent;
    backdrop-filter: blur(0);
  }

  5% {
    background-color: $bg-black-a-10;
  }

  40% {
    background-color: $bg-black-a-10;
    backdrop-filter: blur(0);
  }

  100% {
    background-color: $bg-black-a-90;
    backdrop-filter: blur(3px);
  }
}

@keyframes show-content {
  0% {
    opacity: 0;
  }

  90% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes hide {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
