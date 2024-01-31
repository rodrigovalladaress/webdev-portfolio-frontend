<template>
  <div class="home-wrapper d-flex column justify-content-end full-height">
    <div class="titles-wrapper d-flex column justify-content-end bg-black-a-70 p-1 p-lg-2">
      <div class="h2 lowercase mono-font m-t-auto">London based</div>

      <div class="h1 lowercase mono-font">Full-stack developer</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: "Home",
  order: 0,
});
</script>

<style lang="scss" scoped>
.titles-wrapper {
  backdrop-filter: blur(2px);
  width: fit-content;
}
</style>
