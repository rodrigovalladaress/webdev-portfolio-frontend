<template>
  <nav
    class="nav full-width width-inherit-lg d-flex justify-space-around align-items-center mono-font lowercase bg-black-a-90 bg-trans-lg"
  >
    <template v-for="({ label, href }, i) in items" :key="i">
      <NuxtLink
        class="d-flex justify-content-center align-items-center text-medium"
        :to="href"
        active-class="active"
        @click="onClick"
      >
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

const onClick = () => {
  // Prevent the HTML element to scroll when the page transition animation starts
  // The class overflow-hidden is removed in the set-page-transition middleware
  document.documentElement.classList.add("overflow-hidden");

  (document.activeElement as HTMLElement).blur();
};
</script>

<style lang="scss" scoped>
@use "sass:color";

.nav {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 7.4rem;
  font-size: $t-h6;
  line-height: 1;

  @include media(lg) {
    position: inherit;
    height: fit-content;
    line-height: 1.4;

    // So it's more or less aligned to the title in the left of the screen
    margin-top: 0.1rem;
  }

  > * {
    flex: 1;

    @include media(lg) {
      $x-spacing: 0.5rem;

      font-size: $t-h5;
      padding: 0 $x-spacing;

      &:last-child {
        margin-right: -#{$x-spacing};
      }
    }
  }

  > a {
    height: 100%;

    @include media(lg) {
      $transition-duration: 250ms;

      height: auto;
      position: relative;
      z-index: 0;
      transition: color $transition-duration ease-in-out;

      &::before {
        content: "";
        position: absolute;
        z-index: -1;
        background-color: color.change($text-color, $alpha: 0.1);
        width: 100%;
        height: 100%;
        transform-origin: 0% 50%;
        transform: scale(0%, 100%);
        transition:
          background-color $transition-duration ease-in-out,
          transform $transition-duration ease-in-out;
      }

      &:hover {
        color: #000;

        &::before {
          background-color: $text-color;
          transform: scale(100%, 100%);
        }
      }

      &:focus:not(:active) {
        border: none;
        outline: 2px $text-color dashed;
      }
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
  a.active {
    // Don't use text-decoration, as it's not correctly
    // updated with the .active class for some reason
    color: #000;
    background-color: $text-color;
    pointer-events: none;
  }
}
</style>
