<!-- Based on https://dev.to/luvejo/how-to-build-a-carousel-from-scratch-using-vue-js-4ki0 -->
<template>
  <div class="carousel-and-controls">
    <div class="carousel">
      <div ref="innerRef" class="inner" :style="innerStyle">
        <div
          v-for="({ __carousel_id: id, src, query, alt }, key) in ownItems"
          :key="key"
          class="item"
          :class="`item-${id}`"
          :data-id="id"
        >
          <div class="item-inner">
            <!-- Don't add the image to the HTML until the carousel has been enabled, or the browser will start
            loading the image before the dialog is opened -->
            <img v-if="isEnabled" :src="query ? appendQueryString(src, query) : src" :alt="alt" loading="lazy" />

            <a class="expand" :href="src" target="_blank">
              <div class="link-icon">
                <LinkIcon view-box=""></LinkIcon>
              </div>
            </a>

            <div class="item-index mono-font bg-black-a-80">{{ id + 1 }}/{{ items.length }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="controls d-flex justify-space-between align-items-center">
      <div class="actions">
        <button :disabled="isTransitioning" class="mono-font" @click="showPrevious">
          <div class="button-icon d-flex align-items-center"><ButtonIcon view-box=""></ButtonIcon></div>
        </button>

        <!-- This element has autofocus so it's focused when the project dialog is opened -->
        <button ref="nextButton" :disabled="isTransitioning" class="mono-font" autofocus @click="showNext">
          <div class="button-icon d-flex align-items-center rotate-180">
            <ButtonIcon></ButtonIcon>
          </div>
        </button>
      </div>

      <div class="progress mono-font text-medium d-flex d-none">
        <div v-for="(id, key) in ids" :key="key" :class="[`progress-${id}`, { active: isItemVisible[id] }]">
          {{ id + 1 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CSSProperties } from "vue";
import ButtonIcon from "~/assets/images/AngleLeftThinner.svg?component";
import LinkIcon from "~/assets/images/Link.svg?component";

/**
 * Slide item that comes from props
 */
export type SlideItem = {
  src: string;
  alt: string;
  query?: Record<string, string>;
};

/**
 * Slide item that is used internally by the carousel
 */
type OwnSlideItem = SlideItem & {
  __carousel_id: number;
  isDuplicate?: boolean;
};

const props = withDefaults(defineProps<{ items: SlideItem[]; innerKey: string; isEnabled: boolean }>(), {
  items: () => [],
  innerKey: "",
  isEnabled: false,
});

const { breakpoint } = useBreakpoint();
const resizeListener = useResizeListener();
const { appendQueryString } = useUrl();

/**
 * The index of the carousel.
 * When the user clicks on next -> index += 1
 * When the user clicks on previous -> index -= 1
 *
 * (The index will be always between 0 and items.length - 1,
 * so an index value of -1 would be items.length -1 instead)
 */
const slideIndex = ref(0);
const innerRef = ref<HTMLDivElement | null>(null);
const innerStyle = ref<CSSProperties>({});
const step = ref("");
const stepNegative = ref("");
const isTransitioning = ref(false);
const isItemVisible = ref<Record<number, boolean>>({});
const nextButton = ref<HTMLButtonElement | null>(null);
const ownItems = ref<OwnSlideItem[]>([]);

const itemsWithId = computed<OwnSlideItem[]>(() => addIdKey(props.items, "__carousel_id"));
const ids = computed(() => itemsWithId.value.map(({ __carousel_id: id }) => id));
const ownIsEnabled = computed(() => props.isEnabled);

const getStep = (innerWidth: number, rightSpacing: string, sign: "+" | "-" = "+") => {
  if (ownItems.value.length === 0) {
    // eslint-disable-next-line no-console
    console.warn("The items array is empty");
    return "";
  }

  return `calc(${sign}1 * (${innerWidth}px + ${rightSpacing}) / ${ownItems.value.length})`;
};

const calculateStep = () => {
  if (!innerRef.value || !innerRef.value.children.length) {
    return "";
  }

  const innerWidth = innerRef.value.scrollWidth;

  // Get the margin right of the first .item to calculate the correct translate
  // value that needs to be applied to .inner
  const { marginRight } = window.getComputedStyle(innerRef.value.children[0]);

  step.value = getStep(innerWidth, marginRight);
  stepNegative.value = getStep(innerWidth, marginRight, "-");
};

const resetSlideIndex = () => {
  slideIndex.value = 0;
  calculateVisibleItems();
};

const addSlideIndex = (delta: number) => {
  slideIndex.value = (slideIndex.value + delta) % ownItems.value.length;
  if (slideIndex.value === -1) {
    slideIndex.value = ownItems.value.length - 1;
  }

  calculateVisibleItems();
};

const calculateVisibleItems = () => {
  switch (breakpoint.value) {
    case "xs":
      for (const id of ids.value) {
        isItemVisible.value[id] = id === slideIndex.value;
      }
      break;

    case "sm":
    case "md":
    case "lg":
    case "xl":
    case "xxl":
      for (const id of ids.value) {
        isItemVisible.value[id] = id === slideIndex.value || id === (slideIndex.value + 1) % ownItems.value.length;
      }
      break;

    default:
      // eslint-disable-next-line no-console
      console.error(`Breakpoint '${breakpoint.value}' not implemented`);
      break;
  }
};

const copyFirstItemToTheEnd = () => {
  ownItems.value.push({ ...ownItems.value[0], isDuplicate: true });
};

const removeDuplicates = () => {
  const duplicateIndex = ownItems.value.findIndex(({ isDuplicate }) => isDuplicate);
  if (duplicateIndex === -1) {
    return;
  }

  ownItems.value.splice(duplicateIndex, 1);
};

const showNext = () => {
  if (isTransitioning.value) {
    return;
  }

  isTransitioning.value = true;

  moveLeft();
  addSlideIndex(+1);

  // Do this so the next visible item is added to the DOM before the
  // translate happens
  copyFirstItemToTheEnd();

  addTransitionEndListener(() => {
    const item = ownItems.value.shift();
    if (!item) {
      // eslint-disable-next-line no-console
      console.warn("item was undefined");
      return;
    }

    ownItems.value.push(item);
    resetStyles();

    // Remove duplicates as they aren't necessary anymore
    removeDuplicates();

    // Force the next button to gain focus again, as for some reason
    // is losing focus after the animation is complete
    window.setTimeout(() => {
      focusNextButton();
    });
  });
};

const showPrevious = () => {
  if (isTransitioning.value) {
    return;
  }

  isTransitioning.value = true;

  moveRight();
  addSlideIndex(-1);

  addTransitionEndListener(() => {
    const item = ownItems.value.pop();
    if (!item) {
      // eslint-disable-next-line no-console
      console.warn("item was undefined");
      return;
    }

    ownItems.value.unshift(item);
    resetStyles();
  });
};

const moveLeft = () => {
  // The first translate sets the x position so we can keep an item on the left of the carousel
  innerStyle.value = { transform: `translateX(${stepNegative.value}) translateX(${stepNegative.value})` };
};

const moveRight = () => {
  // The first translate sets the x position so we can keep an item on the left of the carousel
  innerStyle.value = { transform: `translateX(${step.value}) translateX(${stepNegative.value})` };
};

const addTransitionEndListener = (callback: Function) => {
  if (!innerRef.value) {
    return;
  }

  const ownCallback = () => {
    if (!innerRef.value) {
      // eslint-disable-next-line no-console
      console.error("Error while calling transitionend callback: inner reference was null");
      return;
    }

    callback();
    innerRef.value.removeEventListener("transitionend", ownCallback);
    isTransitioning.value = false;
  };

  innerRef.value.addEventListener("transitionend", ownCallback);
};

const resetStyles = () => {
  innerStyle.value = {
    transition: "none",
    // Keep an item on the left of the carousel
    transform: `translateX(${stepNegative.value})`,
  };
};

const getOwnItems = () => {
  const newItems = addIdKey(props.items, "__carousel_id");

  // Move the last item to the beginning of the array so the first element
  // that is shown in the carousel is the initial 0 element
  const lastItem = newItems.pop();
  if (!lastItem) {
    // eslint-disable-next-line no-console
    console.warn("Item was not defined. Array is empty?");
    return [];
  }
  newItems.unshift(lastItem);

  return newItems;
};

const buildOwnItems = () => {
  ownItems.value = getOwnItems();
};

const focusNextButton = () => {
  if (nextButton.value) {
    nextButton.value.focus();
  }
};

const initialize = () => {
  resetSlideIndex();
  calculateStep();
  resetStyles();
  buildOwnItems();
};

const onResize = () => {
  initialize();
};

const onEnabled = () => {
  resizeListener.add(onResize);

  // Force a resize when the carousel is shown,
  // as it's not correctly rendered on mobile
  // when the carousel is shown for the first
  // time
  window.setTimeout(() => {
    onResize();
  });
};

const onDisabled = () => {
  resizeListener.remove();
};

onMounted(() => {
  initialize();

  if (ownIsEnabled.value) {
    onEnabled();
  }
});

onUnmounted(() => {
  onDisabled();
});

watch([props], () => {
  initialize();
});

watch([breakpoint], () => {
  calculateVisibleItems();
});

watch([ownIsEnabled], () => {
  if (ownIsEnabled.value) {
    onEnabled();
  } else {
    onDisabled();
  }
});
</script>

<style lang="scss" scoped>
$transition-duration: 350ms;

.carousel {
  width: 100%;
  overflow: hidden;
  aspect-ratio: 1 / 1;

  @include media(sm) {
    aspect-ratio: auto;
    aspect-ratio: 2 / 1;
  }
}

.inner {
  // Prevent the inline-flex from wrapping once .carousel has been filled
  white-space: nowrap;
  transition: transform $transition-duration ease-in-out;
}

.item {
  $x-spacing: 1.6rem;

  width: 100%;
  display: inline-flex;
  aspect-ratio: 1 / 1;
  margin-right: $x-spacing;

  @include media(sm) {
    width: calc(50% - #{math.div($x-spacing, 2)});
  }
}

.item-inner {
  position: relative;
}

img {
  width: 100%;
  height: auto;
}

$image-over-spacing: 0.5rem;

.expand {
  $duration: 250ms;

  position: absolute;
  background-color: $bg-black;
  padding: 0.3rem 0.39rem;
  top: $image-over-spacing;
  right: $image-over-spacing;
  transition:
    background-color $duration ease-in-out,
    transform $duration ease-in-out;

  .link-icon {
    color: $text-color;

    // Safari needs the sizes to be in the svg element too
    &,
    svg {
      width: 3.5rem;
      height: auto;
      color: $primary;
      transition: color $duration ease-in-out;

      @include media(lg) {
        width: 1.8rem;
      }
    }
  }

  &:hover {
    background-color: $primary;
    transform: scale(1.1);

    &,
    svg {
      color: $bg-black;
    }
  }
}

.item-index {
  position: absolute;
  right: $image-over-spacing;
  bottom: -$image-over-spacing;
  color: $text-color;
  line-height: 1;
  padding: 0.4rem;
  margin-bottom: 1rem;
  font-size: 1.6rem;

  @include media(lg) {
    font-size: 1.1rem;
  }
}

.controls {
  padding: 0.5rem 0;

  @include media(lg) {
    padding: 0;
  }
}

.progress {
  font-size: $t-h6;
  line-height: 1;
  align-self: flex-start;
  margin-top: 0.525rem;

  > * {
    margin-right: 0.5rem;
    text-decoration: underline;
    text-decoration-thickness: 0.1rem;
    text-underline-offset: 0.7rem;
    transition:
      text-decoration-thickness $transition-duration,
      text-underline-offset $transition-duration;

    &.active {
      text-decoration-thickness: 0.4rem;
      text-underline-offset: 0.4rem;
    }
  }
}

button {
  $transition-duration: 200ms;

  margin: 0;
  margin-right: 1.8rem;
  padding: 0.5rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: background-color $transition-duration ease-in-out;

  // outline: 1px solid $text-color;

  @include media(lg) {
    margin-right: 0.8rem;
  }

  .button-icon {
    // color: $text-color;
    color: $primary;
    transition: color $transition-duration ease-in-out;

    // Safari needs the sizes to be in the svg element too
    /* stylelint-disable-next-line no-descending-specificity */
    &,
    svg {
      width: 2.5rem;
      height: auto;

      @include media(lg) {
        width: 1.8rem;
      }
    }
  }

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    // background-color: $text-color;
    background-color: $primary;

    .button-icon {
      color: $bg-black;

      // color: $;
    }
  }

  &:active {
    background-color: $bg-black;

    .button-icon {
      color: $text-color;
    }
  }

  &:focus {
    outline: 2px white dashed;
  }
}
</style>
