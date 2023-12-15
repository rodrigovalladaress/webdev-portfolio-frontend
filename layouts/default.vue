<template>
  <header class="d-flex-lg justify-space-between sticky" :class="{ 'bg-trans': !hasScrolled, 'bg-black': hasScrolled }">
    <h1 class="lowercase bg-black-a-80 bg-trans-lg p-1 p-lg-2">
      <div class="h1 text-medium" :class="{ 'one-line': isOneLineTitle }">
        Rodrigo <br class="d-none d-block-lg" />
        <span class="surname">Valladares Santana</span>
      </div>

      <div class="h2">Full-stack developer</div>
    </h1>

    <NavMenu class="p-lg-2"></NavMenu>
  </header>

  <div class="layout p-1 p-lg-2">
    <slot />
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();

const hasScrolled = ref(false);

// Make the title one line on projects and contact so there's more
// space for the content (only on mobile)
const isOneLineTitle = computed(() => route.path !== "/");

if (process.client) {
  const updateHasScrolled = () => {
    hasScrolled.value = window.scrollY > 0;
  };

  window.addEventListener("scroll", updateHasScrolled);
  // Call the function immediately to update the ref in case
  // the page has been loaded with a scroll
  updateHasScrolled();
}
</script>

<style lang="scss" scoped>
header {
  transition: background-color 200ms ease-in-out;
  z-index: 10;
}

.layout {
  @include media-max(lg) {
    padding-bottom: 8rem;
  }
}

.h1 {
  line-height: 1.2;

  // Correct the line height top spacing
  margin-top: -0.2rem;
  text-overflow: ellipsis;
  overflow: hidden;

  .surname {
    height: 8.81rem;
    opacity: 1;
    display: block;
    transition:
      height 400ms ease-in-out,
      opacity 400ms ease-in-out;
  }

  &.one-line {
    .surname {
      height: 0;
      opacity: 0;
    }
  }

  @include media("lg") {
    line-height: 1.1;
    margin-top: 0;
    white-space: normal;
    overflow: inherit;

    .surname {
      height: auto;
      display: inline;
    }

    &.one-line {
      .surname {
        opacity: 1;
      }
    }
  }
}

.h2 {
  line-height: 1;
  margin-top: 1.4rem;

  @include media("lg") {
    margin-top: 2rem;
  }
}
</style>
