<template>
  <div>
    <h1>Welcome to the homepage (that is a page)</h1>

    <AppAlert>
      This is an auto-imported component
    </AppAlert>

    <NuxtLink to="/about">About</NuxtLink>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss">
  h1 {
    color: $primary;
  }
</style>