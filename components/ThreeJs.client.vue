<template>
  <div class="d-none"></div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{ canvas: HTMLCanvasElement | null }>(), {
  canvas: null,
});

const route = useRoute();

const emit = defineEmits(["loaded"]);

const { initialize, destroy, animate } = useThree();

const initializeThree = () => {
  destroy();

  if (!props.canvas) {
    return;
  }

  initialize(props.canvas, onLoaded);
};

const updateAnimationByRoute = () => {
  if (route.path === "/projects") {
    animate("close");
  } else {
    animate("far");
  }
};

const destroyThree = () => {
  destroy();
};

const onLoaded = () => {
  emit("loaded");

  updateAnimationByRoute();
};

onMounted(() => {
  initializeThree();
});

onBeforeUnmount(() => {
  destroyThree();
});

watch([props], () => {
  initializeThree();
});

watch([() => route.path], () => {
  updateAnimationByRoute();
});
</script>
