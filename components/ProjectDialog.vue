<template>
  <dialog
    ref="dialog"
    class="d-flex column justify-content-center align-items-center bg-trans"
    :class="{ opened: isVisible, closed: !isVisible }"
  >
    <div ref="backdrop" class="backdrop cursor-pointer bg-black-a-90"></div>

    <div class="content text-color-regular">
      <div class="header d-flex justify-space-between">
        <h2 class="title h2 mono-font">{{ project.name }}</h2>

        <button class="close-btn mono-font text-bold uppercase cursor-pointer" @click="onCloseClicked">x</button>
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

      <template v-if="project.links?.length">
        <h3 class="h3 mono-font lowercase skills">Links</h3>

        <div class="links">
          <a v-for="({ label, href }, key) in project.links" :key="key" class="btn" :href="href" target="_blank">
            {{ label }}

            <LinkIcon class="icon"></LinkIcon>
          </a>
        </div>
      </template>
    </div>
  </dialog>
</template>

<script lang="ts" setup>
import type { Project } from "~/types/project";

import LinkIcon from "~/assets/images/Link.svg?component";

export type Props = {
  isVisible: boolean;
  project: Project;
};

const props = withDefaults(defineProps<Props>(), {
  isVisible: false,
});

const emit = defineEmits(["closed"]);

const { saveScroll, injectScroll, restoreScroll, recalculateScrollbarWidth } = useDialogLayoutShiftFix();

// Prop sent to the carousel to force the calculation of its
// step when the dialog is shown
const carouselKey = ref(0);
const dialog = ref<HTMLDialogElement | null>(null);
const backdrop = ref<HTMLDivElement | null>(null);

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

const addBackdropEventListener = () => {
  if (backdrop.value) {
    backdrop.value.addEventListener("click", onBackdropClicked);
  }
};

const removeBackdropEventListener = () => {
  if (backdrop.value) {
    backdrop.value.removeEventListener("click", onBackdropClicked);
  }
};

const show = () => {
  if (dialog.value) {
    saveScroll();
    recalculateScrollbarWidth();

    dialog.value.showModal();
    carouselKey.value += 1;

    injectScroll();
  }
};

const close = () => {
  if (dialog.value) {
    dialog.value.close("dismiss");

    restoreScroll();
  }
};

const onCloseClicked = () => {
  if (!dialog.value) {
    return;
  }

  close();
  emit("closed");
};

const onBackdropClicked = () => {
  close();
  emit("closed");
};

onMounted(() => {
  updateVisibility();

  // Remove event listener before adding it in case it was added already
  removeBackdropEventListener();
  addBackdropEventListener();
});

onUnmounted(() => {
  removeBackdropEventListener();
});

watch([props, dialog], () => {
  updateVisibility();
});

watch([backdrop], () => {
  // Remove event listener before adding it in case it was added already
  removeBackdropEventListener();
  addBackdropEventListener();
});
</script>

<style lang="scss" scope>
dialog {
  // position: absolute;
  position: fixed;
  inset: 0;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  height: 100%;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;

  .backdrop {
    // position: absolute;
    // position: ;
    position: fixed;
    inset: 0;
    z-index: -1;
    backdrop-filter: blur(3px);
  }

  .content {
    width: 100%;
    flex-grow: 1;
    height: 100%;
    border: 2px solid $text-color;
    padding: 2rem;
    overflow-y: auto;

    @include media(md) {
      flex-grow: 0;
      max-width: 608px;
      height: fit-content;
    }
  }

  .close-btn {
    $right-spacing: 0.4rem;
    $transition-duration: 250ms;

    border: none;
    height: fit-content;
    padding: 0.1rem $right-spacing 0.245rem 0.295rem;
    margin-right: -$right-spacing;
    color: $text-color;
    background-color: $bg-black;
    line-height: 1;
    transition:
      color $transition-duration ease-in-out,
      background-color $transition-duration ease-in-out;

    &:hover,
    &:active {
      color: $bg-black;
      background-color: $text-color;
    }

    &:active {
      outline: 2px white dashed;
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

  .links {
    margin-top: 1.64rem;
    margin-bottom: 0.5rem;
  }
}

$open-animation-duration: 500ms;
$close-animation-duration: 300ms;

// Animate the dialog
// https://codepen.io/fmontes/pen/yLveywJ
// Opened dialog
dialog[open] {
  // overscroll-behavior: contain;

  .backdrop {
    background-color: transparent;
    backdrop-filter: blur(0);
    animation: show-backdrop #{$open-animation-duration * 0.65} ease-in-out normal forwards;

    // animation: show-backdrop 50ms ease-in-out normal forwards;

    animation-delay: #{$open-animation-duration};
  }

  .content {
    // overscroll-behavior: contain;
    animation: show-dialog $open-animation-duration ease-in-out normal forwards;
  }

  // Play the animation on the children of content so the border is visible
  // from the beginning of the animation
  .content > * {
    opacity: 0;
    background-color: transparent;
    animation: show-content #{$open-animation-duration * 0.65} ease-in-out normal forwards;
    animation-delay: $open-animation-duration * 0.65;
  }
}

// Closed dialog
dialog:not([open]) {
  pointer-events: none;

  .backdrop {
    background-color: transparent;
    backdrop-filter: blur(0);
  }

  .content {
    animation: hide-dialog $close-animation-duration ease-in-out reverse forwards;
  }

  .content > * {
    opacity: 0;
  }
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
    background-color: transparent;
  }

  100% {
    transform: translateY(0%) scale(100%);
    background-color: $bg-black;
  }
}

@keyframes show-backdrop {
  0% {
    background-color: transparent;
    backdrop-filter: blur(0);
  }

  // 5% {
  //   background-color: $bg-black-a-90;
  //   backdrop-filter: blur(3px);
  // }

  100% {
    background-color: $bg-black-a-90;
    backdrop-filter: blur(3px);
  }
}

@keyframes show-content {
  0% {
    opacity: 0;
    background-color: transparent;
  }

  100% {
    opacity: 1;
    background-color: $bg-black;
  }
}

// This animation is reversed
@keyframes hide-dialog {
  0% {
    transform: translateY(-75%) scale(0%);
    opacity: 0;
  }

  33% {
    transform: translateY(-75%) scale(50%);
    opacity: 1;
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
</style>
