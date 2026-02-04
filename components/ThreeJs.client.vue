<template>
  <div class="d-none"></div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{ canvas: HTMLCanvasElement | null }>(), {
  canvas: null,
});

const emit = defineEmits(["loaded"]);

const { initialize, destroy } = useThree();

const initializeThree = () => {
  destroy();

  if (!props.canvas) {
    return;
  }

  initialize(props.canvas, onLoaded);
};

const destroyThree = () => {
  destroy();
};

const onLoaded = () => {
  emit("loaded");
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
</script>
