<template>
  <div>
    <section>
      <p>This page will be displayed at the /about route.</p>
    </section>

    <NuxtLink to="/">Home</NuxtLink>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  pageTransition: {
    name: "rotate",
  },
});
</script>

<!-- <style lang="scss"></style> -->
