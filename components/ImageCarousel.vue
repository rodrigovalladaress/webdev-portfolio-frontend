<!-- https://dev.to/luvejo/how-to-build-a-carousel-from-scratch-using-vue-js-4ki0 -->
<template>
  <div class="carousel">
    <div ref="inner" class="inner" :style="innerStyle">
      <div v-for="({ src, alt }, i) in items" :key="i" class="item">
        <NuxtImg :src="src" :alt="alt" />
      </div>
    </div>
  </div>

  <button :disabled="isTransitioning" @click="showPrevious">prev</button>

  <button :disabled="isTransitioning" @click="showNext">next</button>
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
const isTransitioning = ref(false);

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

const calculateStep = () => {
  if (!inner.value) {
    // eslint-disable-next-line no-console
    console.warn("inner reference was null");
    return;
  }

  if (items.length === 0) {
    // eslint-disable-next-line no-console
    console.warn("The items array is empty");
    return;
  }

  const innerWidth = inner.value.scrollWidth;
  step.value = `${innerWidth / items.length}px`;
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
  innerStyle.value = { transform: `translateX(-${step.value}) translateX(-${step.value})` };
};

const moveRight = () => {
  // The first translate sets the x position so we can keep an item on the left of the carousel
  innerStyle.value = { transform: `translateX(${step.value}) translateX(-${step.value})` };
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
    transform: `translateX(-${step.value})`,
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
}

.inner {
  // Prevent the inline-flex from wrapping once .carousel has been filled
  white-space: nowrap;
  transition: transform 350ms ease-in-out;
}

.item {
  width: 100%;
  margin-right: 1rem;
  display: inline-flex;
  aspect-ratio: 1 / 1;

  @include media(lg) {
    width: 28.8rem;
  }
}

img {
  width: 100%;
  height: auto;
}

button {
  margin-right: 0.5rem;
  margin-top: 1rem;
}
</style>
