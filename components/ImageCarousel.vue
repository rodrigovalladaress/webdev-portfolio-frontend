<!-- Based on https://dev.to/luvejo/how-to-build-a-carousel-from-scratch-using-vue-js-4ki0 -->
<template>
  <div class="carousel-and-controls">
    <div class="carousel">
      <div ref="innerRef" class="inner" :style="innerStyle">
        <div
          v-for="({ __carousel_id: id, src, alt }, key) in ownItems"
          :key="key"
          class="item"
          :class="`item-${id}`"
          :data-id="id"
        >
          <NuxtImg :src="src" :alt="alt" />
        </div>
      </div>
    </div>

    <div class="controls d-flex justify-space-between align-items-center">
      <div class="progress mono text-medium d-flex">
        <div v-for="(id, key) in ids" :key="key" :class="[`progress-${id}`, { active: isItemVisible[id] }]">
          {{ id + 1 }}
        </div>
      </div>

      <div class="actions">
        <button :disabled="isTransitioning" class="mono" @click="showPrevious">
          <div class="icon d-flex align-items-center"><ButtonIcon view-box=""></ButtonIcon></div>
        </button>

        <button :disabled="isTransitioning" class="mono" @click="showNext">
          <div class="icon d-flex align-items-center rotate-180"><ButtonIcon></ButtonIcon></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CSSProperties } from "vue";
import ButtonIcon from "~/assets/images/AngleLeftThinner.svg?component";

// console.log("angle left", AngleLeft);

/**
 * Slide item that comes from props
 */
export type SlideItem = {
  src: string;
  alt: string;
};

/**
 * Slide item that is used internally by the carousel
 */
type OwnSlideItem = SlideItem & {
  __carousel_id: number;
  isDuplicate?: boolean;
};

const props = defineProps({
  innerKey: {
    type: String,
    default: "",
    required: false,
  },
});

const { breakpoint } = useBreakpoint();

// TODO move this to props
const items = [
  {
    src: "TestImage1.jpg",
    alt: "A test image",
  },
  {
    src: "TestImage2.jpg",
    alt: "A test image",
  },
  {
    src: "TestImage3.jpg",
    alt: "A test image",
  },
];

const itemsWithId: OwnSlideItem[] = addIdKey(items, "__carousel_id");
const ids: number[] = itemsWithId.map(({ __carousel_id: id }) => id);

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
const ownItems = ref<OwnSlideItem[]>([...itemsWithId]);

const getStep = (innerWidth: number, rightSpacing: string, sign: "+" | "-" = "+") => {
  if (ownItems.value.length === 0) {
    // eslint-disable-next-line no-console
    console.warn("The items array is empty");
    return "";
  }

  return `calc(${sign}1 * (${innerWidth}px + ${rightSpacing}) / ${ownItems.value.length})`;
};

const calculateStep = () => {
  if (!innerRef.value) {
    return "";
  }

  const innerWidth = innerRef.value.scrollWidth;

  // Get the margin right of the first .item to calculate the correct translate
  // value that needs to be applied to .inner
  const { marginRight } = window.getComputedStyle(innerRef.value.children[0]);

  step.value = getStep(innerWidth, marginRight);
  stepNegative.value = getStep(innerWidth, marginRight, "-");
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
      for (const id of ids) {
        isItemVisible.value[id] = id === slideIndex.value;
      }
      break;

    case "sm":
    case "md":
    case "lg":
    case "xl":
    case "xxl":
      for (const id of ids) {
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
  const newItems = addIdKey(items, "__carousel_id");

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

const initialize = () => {
  calculateStep();
  resetStyles();
  buildOwnItems();
  calculateVisibleItems();
};

onMounted(() => {
  initialize();

  window.addEventListener("resize", () => {
    initialize();
  });
});

watch([props], () => {
  initialize();
});

watch([breakpoint], () => {
  calculateVisibleItems();
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
  width: 100%;
  display: inline-flex;
  aspect-ratio: 1 / 1;
  margin-right: 1.6rem;

  @include media(sm) {
    width: 50%;
  }
}

img {
  width: 100%;
  height: auto;
}

.controls {
  padding: 0.5rem 0;
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
  margin-right: 0.8rem;
  padding: 0.5rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: background-color $transition-duration ease-in-out;

  .icon {
    color: $text-color;
    transition: color $transition-duration ease-in-out;

    // width: 2.8rem;
    width: 2rem;
    height: auto;

    @include media(lg) {
      // width: 2.4rem;
      width: 1.8rem;
    }
  }

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    background-color: $text-color;

    .icon {
      color: $bg-black;
    }
  }
}
</style>
