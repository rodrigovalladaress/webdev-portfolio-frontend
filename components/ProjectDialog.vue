<template>
  <dialog ref="dialog" class="project-dialog" :class="{ opened: isVisible, closed: !isVisible }">
    <div ref="backdrop" class="backdrop"></div>

    <div class="content-scroll">
      <div class="content-wrapper">
        <div class="content">
          <div class="header d-flex justify-space-between">
            <h2 class="title">{{ project.name }}</h2>
          </div>

          <template v-if="project.client">
            <h3 class="client">
              Client: <a class="client-name" :href="project.clientLink" target="_blank">{{ project.client }}</a>
            </h3>
          </template>

          <ImageCarousel
            v-if="project.images?.length"
            class="project-carousel"
            :inner-key="`${carouselKey}`"
            :items="project.images || []"
            :is-enabled="isVisible"
          ></ImageCarousel>

          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="description" v-html="project.description"></div>

          <template v-if="project.skills?.length">
            <h3 class="section-title">Skills</h3>

            <div class="tags">
              <div v-for="(skill, key) in project.skills" :key="key" class="tag">
                {{ skill }}
              </div>
            </div>
          </template>

          <template v-if="project.links?.length">
            <h3 class="section-title">Links</h3>

            <div class="links">
              <a v-for="({ label, href }, key) in project.links" :key="key" class="btn" :href="href" target="_blank">
                {{ label }}

                <div class="icon-wrapper">
                  <LinkIcon class="icon"></LinkIcon>
                </div>
              </a>
            </div>
          </template>
        </div>

        <button class="close-btn" @click="onCloseClicked">
          <span>x</span>
        </button>
      </div>
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

const router = useRouter();

const { saveScroll, injectScroll, restoreScroll, recalculateScrollbarWidth } = useDialogLayoutShiftFix();

// Flag that stores if the dialog has been closed once.
// The dialog is closed automatically on page load (on onMounted),
// and when that happens, the close animation is not played. When
// the dialog closes again later, the animation should play though,
// and having this flag helps the algorithm that does that.
let hasBeenClosedOnce = false;

// Prop sent to the carousel to force the calculation of its
// step when the dialog is shown
const carouselKey = ref(0);
const dialog = ref<HTMLDialogElement | null>(null);
const backdrop = ref<HTMLDivElement | null>(null);
// const isInitialized = ref(false);

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

const injectDialogCloseDurationVariable = () => {
  injectCssVariable("--project-dialog-close-duration", "500ms");
};

const clearDialogCloseDurationVariable = () => {
  injectCssVariable("--project-dialog-close-duration", null);
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
    if (hasBeenClosedOnce) {
      // Allow the close animation to have enough duration to be animated
      // (it's 0ms by default so it's not animated when the dialog is
      // closed for the first time).
      injectDialogCloseDurationVariable();
    } else {
      hasBeenClosedOnce = true;
    }

    dialog.value.close("dismiss");

    restoreScroll();
  }

  router.push("/projects");
};

const onCloseClicked = () => {
  if (!dialog.value) {
    return;
  }

  close();
};

const onBackdropClicked = () => {
  close();
};

onMounted(() => {
  updateVisibility();

  // Remove event listener before adding it in case it was added already
  removeBackdropEventListener();
  addBackdropEventListener();
});

onUnmounted(() => {
  clearDialogCloseDurationVariable();

  removeBackdropEventListener();
});

// watch([props, dialog], () => {
watch([props], () => {
  updateVisibility();
});

watch([backdrop], () => {
  // Remove event listener before adding it in case it was added already
  removeBackdropEventListener();
  addBackdropEventListener();
});
</script>

<style lang="scss">
:root {
  /* 
  This is used by the close dialog animation.
  By default is 0 so the dialog is not animated on page load,
  but it's updated when the dialog is closed once, so it's
  animated afterwards.
  */
  --project-dialog-close-duration: 0ms;
}
</style>

<style lang="scss" scoped>
.project-dialog {
  flex-flow: column;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  overflow-y: visible;
}

.content-scroll {
  width: 100%;
  flex-grow: 1;
  min-height: 100%;
  overflow: auto;
  display: flex;
  justify-content: center;
}

.content-wrapper {
  --content-border-width: 2px;

  position: relative;
  color: white;

  @include media(md) {
    flex-grow: 0;
    max-width: 38rem;
    height: fit-content;
  }
}

.content {
  padding: 20px;
  border: var(--content-border-width) white solid;
}

.title,
.client {
  line-height: 1.1;

  @media (--lg) {
    line-height: 1.3;
  }
}

.title {
  font-size: var(--t-h5);
  font-weight: 600;

  /* Optical alignment */
  margin-top: -0.4rem;

  @media (--lg) {
    font-size: var(--t-h3);

    /* Optical alignment */
    margin-block-start: -0.8rem;
  }
}

.client {
  font-size: var(--t-h5);
}

.description {
  font-size: 1.2rem;
  line-height: 1.5;
}

.backdrop {
  position: fixed;
  inset: 0;
  z-index: -1;
  backdrop-filter: blur(3px);
}

.close-btn {
  --transition-duration: 250ms;

  position: absolute;
  border: none;
  height: fit-content;
  display: block;
  cursor: pointer;
  font-size: 28px;
  line-height: 1;
  top: var(--content-border-width);
  right: var(--content-border-width);
  padding: 20px;
  color: var(--color-primary);
  background-color: transparent;
  transition:
    color var(--transition-duration) ease-in-out,
    background-color var(--transition-duration) ease-in-out;

  span {
    display: block;

    /* Optical alignment */
    margin-block-start: -6px;
  }

  &:hover,
  &:active {
    color: var(--color-bg-black);
    background-color: var(--color-primary);
  }

  &:focus:not(:active) {
    outline: 2px $text-color dashed;
  }
}

.project-carousel {
  margin-block: 24px 28px;
}

.section-title {
  font-size: var(--t-h5);
  margin: 1.875rem 0 0.8rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 13px 10px;
}

.tag {
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 1rem;
  font-family: var(--font-mono);
  border: 1px solid white;
}

.links {
  display: flex;
  flex-direction: column;
  gap: 15px;

  @include media(sm) {
    gap: 25px;
    flex-flow: row wrap;
  }

  margin-block-end: 0.5rem;

  .icon-wrapper {
    width: 1.25rem;
  }
}

// Animate the dialog
// https://codepen.io/fmontes/pen/yLveywJ
// Opened dialog
// dialog[open] {
dialog.opened {
  $open-animation-duration: 500ms;

  display: flex;
  position: fixed;
  inset: 0;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  max-width: 100dvw;
  overflow-x: hidden;
  min-height: 100dvh;

  .backdrop {
    background-color: transparent;
    backdrop-filter: blur(0);
    animation: show-backdrop #{$open-animation-duration * 0.65} ease-in-out normal forwards;
    animation-delay: #{$open-animation-duration};
  }

  .content {
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
dialog.closed {
  pointer-events: none;
  animation: hide-dialog-wrapper var(--project-dialog-close-duration, 0ms) ease-in-out normal forwards;

  .backdrop {
    background-color: transparent;
    backdrop-filter: blur(0);
  }

  .content {
    animation: hide-dialog var(--project-dialog-close-duration, 0ms) ease-in-out reverse forwards;
  }

  .content > * {
    opacity: 0;
  }
}

@keyframes hide-dialog-wrapper {
  0% {
    display: flex;
    opacity: 1;
  }

  100% {
    display: none;
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
