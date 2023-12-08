<template>
  <header class="d-flex-lg justify-space-between bg-black-a-80-lg p-1">
    <h1 class="lowercase p-r-lg-1">
      <div class="h1 text-medium">
        Rodrigo <br class="d-none d-block-lg" />
        Valladares Santana
      </div>

      <div class="h2">Full-stack developer</div>
    </h1>

    <NavMenu></NavMenu>
  </header>

  <div class="layout p-1">
    <slot />

    <!-- <footer>Footer</footer> -->
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.h1 {
  line-height: 1.2;

  @include media("lg") {
    line-height: 1.1;
  }
}

.h2 {
  line-height: 1;
  margin-top: 1.4rem;

  @include media("lg") {
    margin-top: 2rem;
  }
}

.layout {
  // padding: 1.6rem;
}
</style>
