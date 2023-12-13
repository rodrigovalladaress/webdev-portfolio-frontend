<template>
  <div class="d-none"></div>
</template>

<script lang="ts" setup>
import type ThreeExperience from "~/experience/ThreeExperience";

const emit = defineEmits(["loaded"]);

let experience: ThreeExperience | null = useThree("#three", () => {
  emit("loaded");
});

onBeforeUnmount(() => {
  experience?.destroy();
  experience = null;
});
</script>
