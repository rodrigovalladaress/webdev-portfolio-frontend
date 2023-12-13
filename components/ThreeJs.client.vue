<template>
  <div class="d-none"></div>
</template>

<script lang="ts" setup>
import type ThreeExperience from "~/experience/ThreeExperience";

let experience: ThreeExperience | null = useThree();

onBeforeUnmount(() => {
  experience?.destroy();
  experience = null;
});
</script>

<style lang="scss">
#three {
  z-index: -1;
}
</style>
