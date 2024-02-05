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
  switch (route.path) {
    case "/":
      animate("home");
      break;

    case "/projects":
      animate("projects");
      break;

    case "/contact":
      animate("contact");
      break;

    default:
      // eslint-disable-next-line no-console
      console.warn(`Route '${route.path}' is not animated`);
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
