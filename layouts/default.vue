<template>
  <div class="layout p-1">
    <header>
      <h1>
        <div class="h1 text-medium">rodrigo valladares santana</div>

        <div class="h2">full stack developer</div>
      </h1>
    </header>

    <NavMenu></NavMenu>

    <slot />

    <!-- <footer>Footer</footer> -->
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.h1 {
  line-height: 1.2;

  @include media("lg") {
    line-height: 1;
  }
}

.h2 {
  line-height: 1;
  margin-top: 1.4rem;

  @include media("lg") {
    margin-top: 2.2rem;
  }
}

.layout {
  // padding: 1.6rem;
}
</style>
