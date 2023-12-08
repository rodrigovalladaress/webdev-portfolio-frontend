<template>
  <nav
    class="nav full-width width-inherit-lg d-flex justify-space-around align-items-center mono-font lowercase bg-black-a-90 bg-trans-lg"
  >
    <template v-for="({ label, href }, i) in items" :key="i">
      <NuxtLink class="d-flex justify-center align-items-center text-medium" :to="href" active-class="active">
        {{ label }}
      </NuxtLink>

      <div v-if="i != items.length - 1" class="d-none d-block-lg pointer-events-none">/</div>
    </template>
  </nav>
</template>

<script lang="ts" setup>
const items = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];
</script>

<style lang="scss" scoped>
.nav {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 7.4rem;
  font-size: 1.92rem;
  line-height: 1;

  @include media(lg) {
    position: inherit;
    height: fit-content;
  }

  > * {
    flex: 1;

    @include media(lg) {
      font-size: 3.318rem;
      margin-top: 0.5rem;
    }
  }

  // Style for very small screens
  @media screen and (width < 320px) {
    flex-wrap: wrap;
    height: inherit;

    > * {
      flex: 1 1 100%;
      padding: 0.9rem 0;
    }
  }
}
</style>

<style lang="scss">
.nav {
  .active {
    text-decoration: underline !important;

    @include media(lg) {
      text-decoration: underline !important;
      text-decoration-thickness: 2px;
      text-underline-offset: 10px;

      // border-bottom: 2px $text-color solid;
    }
  }
}
</style>
