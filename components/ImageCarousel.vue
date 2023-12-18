<!-- https://dev.to/luvejo/how-to-build-a-carousel-from-scratch-using-vue-js-4ki0 -->
<template>
  <div class="carousel-and-controls">
    <div class="carousel">
      <div ref="inner" class="inner" :style="innerStyle">
        <div v-for="({ src, alt }, i) in items" :key="i" class="item">
          <NuxtImg :src="src" :alt="alt" />
        </div>
      </div>
    </div>

    <div class="controls d-flex justify-space-between">
      <div class="progress d-flex">
        <div v-for="(index, i) in indexes" :key="i" :class="`progress-${i + 1}`">
          {{ index + 1 }}
        </div>
      </div>

      <div class="actions">
        <button :disabled="isTransitioning" class="mono" @click="showPrevious">
          <div class="text">&lt;</div>
        </button>

        <button :disabled="isTransitioning" class="mono" @click="showNext">
          <div class="text">&gt;</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CSSProperties } from "vue";

const props = defineProps({
  innerKey: {
    type: String,
    default: "",
    required: false,
  },
});

const inner = ref<HTMLDivElement | null>(null);
const innerStyle = ref<CSSProperties>({});
const step = ref("");
const stepNegative = ref("");
const isTransitioning = ref(false);

const items = [
  {
    index: 0,
    src: "TestImage1.jpg",
    alt: "A test image",
  },
  {
    index: 1,
    src: "TestImage2.jpg",
    alt: "A test image",
  },
  {
    index: 2,
    src: "TestImage3.jpg",
    alt: "A test image",
  },
];
const indexes: number[] = items.map(({ index }) => index);

const getStep = (innerWidth: number, rightSpacing: string, sign: "+" | "-" = "+") => {
  if (items.length === 0) {
    // eslint-disable-next-line no-console
    console.warn("The items array is empty");
    return "";
  }

  return `calc(${sign}1 * (${innerWidth}px + ${rightSpacing}) / ${items.length})`;
};

const calculateStep = () => {
  if (!inner.value) {
    // eslint-disable-next-line no-console
    console.warn("inner reference was null");
    return "";
  }

  const innerWidth = inner.value.scrollWidth;

  // Get the margin right of the first .item to calculate the correct translate
  // value that needs to be applied to .inner
  const { marginRight } = window.getComputedStyle(inner.value.children[0]);

  step.value = getStep(innerWidth, marginRight);
  stepNegative.value = getStep(innerWidth, marginRight, "-");
};

const showNext = () => {
  if (isTransitioning.value) {
    return;
  }

  isTransitioning.value = true;

  moveLeft();

  addTransitionEndListener(() => {
    const item = items.shift();
    if (!item) {
      // eslint-disable-next-line no-console
      console.warn("item was undefined");
      return;
    }

    items.push(item);
    resetStyles();
  });
};

const showPrevious = () => {
  if (isTransitioning.value) {
    return;
  }

  isTransitioning.value = true;

  moveRight();

  addTransitionEndListener(() => {
    const item = items.pop();
    if (!item) {
      // eslint-disable-next-line no-console
      console.warn("item was undefined");
      return;
    }

    items.unshift(item);
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
  if (!inner.value) {
    return;
  }

  const ownCallback = () => {
    if (!inner.value) {
      // eslint-disable-next-line no-console
      console.error("Error while calling transitionend callback: inner reference was null");
      return;
    }

    callback();
    inner.value.removeEventListener("transitionend", ownCallback);
    isTransitioning.value = false;
  };

  inner.value.addEventListener("transitionend", ownCallback);
};

const resetStyles = () => {
  innerStyle.value = {
    transition: "none",
    // Keep an item on the left of the carousel
    transform: `translateX(${stepNegative.value})`,
  };
};

const initialize = () => {
  calculateStep();
  resetStyles();
};

onMounted(() => {
  initialize();
  window.addEventListener("resize", initialize);

  // Move the last item to the beginning of the array so the first element
  // that is shown in the carousel is the initial 0 element
  const item = items.pop();
  if (!item) {
    // eslint-disable-next-line no-console
    console.warn("item was not defined");
    return;
  }
  items.unshift(item);
});

watch([props], () => {
  initialize();
});
</script>

<style lang="scss" scoped>
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
  transition: transform 350ms ease-in-out;
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
  background-color: red;
}

button {
  $y-padding: 0.45rem;

  margin: 0;
  margin-right: 0.5rem;
  font-size: 2.4rem;
  font-weight: bold;
  background-color: transparent;
  color: $text-color;
  border: none;
  line-height: 1;
  padding: 0.1rem $y-padding 0.45rem;
  transition:
    background-color 200ms ease-in-out,
    color 200ms ease-in-out;

  &:last-child {
    // margin-right: -$y-padding;
    margin-right: 0;
  }

  &:hover {
    background-color: $text-color;
    color: $bg-black;
  }
}
</style>
