<template>
  <nav class="nav full-width flex justify-space-around mono-font lowercase bg-color-trans-90">
    <template v-for="({ label, href }, i) in items" :key="i">
      <NuxtLink class="flex justify-center align-center" :to="href" active-class="active">
        {{ label }}
      </NuxtLink>
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

  // background-color: red;
  font-size: 1.92rem;

  > * {
    flex: 1;
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
  }
}
</style>
