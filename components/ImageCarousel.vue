<!-- https://dev.to/luvejo/how-to-build-a-carousel-from-scratch-using-vue-js-4ki0 -->
<template>
  <div class="carousel-and-controls">
    <div class="carousel">
      <div ref="innerRef" class="inner" :style="innerStyle">
        <div
          v-for="({ __id: id, src, alt }, key) in items"
          :key="key"
          class="item"
          :class="`item-${id}`"
          :data-__id="id"
        >
          <NuxtImg :src="src" :alt="alt" />
        </div>
      </div>
    </div>

    <div class="controls d-flex justify-space-between">
      <div class="progress d-flex">
        <div v-for="(id, key) in ids" :key="key" :class="[`progress-${id}`, { active: isItemVisible[id] }]">
          {{ id + 1 }}
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

const { breakpoint } = useBreakpoint();

/**
 * The index of the carousel.
 * When the user clicks on next -> index += 1
 * When the user clicks on previous -> index -= 1
 *
 * (The index will be always between 0 and items.length - 1,
 * so an index value of -1 would be items.length -1 instead)
 */
const index = ref(0);
const innerRef = ref<HTMLDivElement | null>(null);
const innerStyle = ref<CSSProperties>({});
const step = ref("");
const stepNegative = ref("");
const isTransitioning = ref(false);
const isItemVisible = ref<Record<number, boolean>>({});
const items = ref([
  {
    __id: 0,
    src: "TestImage1.jpg",
    alt: "A test image",
  },
  {
    __id: 1,
    src: "TestImage2.jpg",
    alt: "A test image",
  },
  {
    __id: 2,
    src: "TestImage3.jpg",
    alt: "A test image",
  },
]);

const ids: number[] = items.value.map(({ __id }) => __id);

const getStep = (innerWidth: number, rightSpacing: string, sign: "+" | "-" = "+") => {
  if (items.value.length === 0) {
    // eslint-disable-next-line no-console
    console.warn("The items array is empty");
    return "";
  }

  return `calc(${sign}1 * (${innerWidth}px + ${rightSpacing}) / ${items.value.length})`;
};

const calculateStep = () => {
  if (!innerRef.value) {
    // eslint-disable-next-line no-console
    console.warn("inner reference was null");
    return "";
  }

  const innerWidth = innerRef.value.scrollWidth;

  // Get the margin right of the first .item to calculate the correct translate
  // value that needs to be applied to .inner
  const { marginRight } = window.getComputedStyle(innerRef.value.children[0]);

  step.value = getStep(innerWidth, marginRight);
  stepNegative.value = getStep(innerWidth, marginRight, "-");
};

const addIndex = (delta: number) => {
  index.value = (index.value + delta) % items.value.length;
  if (index.value === -1) {
    index.value = items.value.length - 1;
  }

  calculateVisibleItems();
};

const calculateVisibleItems = () => {
  switch (breakpoint.value) {
    case "xs":
    case "sm":
      for (const id of ids) {
        isItemVisible.value[id] = id === index.value;
      }
      break;

    // TODO Fix visible items for tablet + desktiop
    case "md":
    case "lg":
    case "xl":
    case "xxl":
      for (const id of ids) {
        isItemVisible.value[id] = id === index.value || id === (index.value + 1) % items.value.length;
      }
      break;

    default:
      // eslint-disable-next-line no-console
      console.error(`Breakpoint '${breakpoint.value}' not implemented`);
      break;
  }
};

const showNext = () => {
  if (isTransitioning.value) {
    return;
  }

  isTransitioning.value = true;

  moveLeft();
  addIndex(+1);

  addTransitionEndListener(() => {
    const item = items.value.shift();
    if (!item) {
      // eslint-disable-next-line no-console
      console.warn("item was undefined");
      return;
    }

    items.value.push(item);
    resetStyles();
  });
};

const showPrevious = () => {
  if (isTransitioning.value) {
    return;
  }

  isTransitioning.value = true;

  moveRight();
  addIndex(-1);

  addTransitionEndListener(() => {
    const item = items.value.pop();
    if (!item) {
      // eslint-disable-next-line no-console
      console.warn("item was undefined");
      return;
    }

    items.value.unshift(item);
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

const initialize = () => {
  calculateStep();
  resetStyles();
};

onMounted(() => {
  initialize();
  window.addEventListener("resize", initialize);

  // Move the last item to the beginning of the array so the first element
  // that is shown in the carousel is the initial 0 element
  const item = items.value.pop();
  if (!item) {
    // eslint-disable-next-line no-console
    console.warn("item was not defined");
    return;
  }
  items.value.unshift(item);

  calculateVisibleItems();
});

watch([props], () => {
  initialize();
});

watch([breakpoint], () => {
  calculateVisibleItems();
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

.progress {
  .active {
    text-decoration: underline;
  }
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
