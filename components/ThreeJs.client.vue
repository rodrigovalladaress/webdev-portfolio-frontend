<template>
  <div class="d-none"></div>
</template>

<script lang="ts" setup>
const experience = useThree();

onBeforeUnmount(() => {
  experience.destroy();
});
</script>

<style lang="scss">
#three {
  z-index: -1;
}
</style>
