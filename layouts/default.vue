<template>
  <div class="layout-wrapper d-flex column align-items-center">
    <div class="layout-inner-wrapper d-flex column">
      <header
        ref="header"
        class="d-flex-lg justify-space-between sticky"
        :class="{ 'bg-trans': !hasScrolled, 'bg-black': hasScrolled }"
      >
        <h1 class="lowercase bg-black-a-80 bg-trans-lg p-1 p-lg-2">
          <div class="h1 text-medium" :class="{ 'one-line': !isHome }">
            Rodrigo <br class="d-none d-block-lg" />
            <span class="surname">Valladares Santana</span>
          </div>

          <div class="h2 subtitle" :class="{ hidden: isHome }">Full-stack developer</div>
        </h1>

        <NavMenu class="p-lg-2"></NavMenu>
      </header>

      <div class="layout">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const { injectHeaderHeight, updateHeaderElement } = useDialogLayoutShiftFix();
const resizeListener = useResizeListener();
const scrollListener = useScrollListener();

const header = ref<HTMLElement | null>(null);
const hasScrolled = ref(false);

// Make the title one line on projects and contact so there's more
// space for the content (only on mobile)
const isHome = computed(() => route.path === "/");

if (process.client) {
  const updateHasScrolled = () => {
    hasScrolled.value = window.scrollY > 0;
  };

  scrollListener.add(updateHasScrolled);
  // Call the function immediately to update the ref in case
  // the page has been loaded with a scroll
  updateHasScrolled();

  resizeListener.add(injectHeaderHeight);
}

onMounted(() => {
  injectHeaderHeight();
});

watch([header], () => {
  updateHeaderElement(header.value);

  injectHeaderHeight();
});
</script>

<style lang="scss" scoped>
header {
  // width: 100%;
  transition: background-color 200ms ease-in-out;
  z-index: 10;
}

// Dialog scroll fix (see _dialog-scroll-fix.scss and dialogScrollFix.ts)
body:has(dialog[open]) {
  header {
    position: absolute;
    top: calc(var(--scroll-y-fix, 0) - var(--header-height, 0));
    width: 100%;
    background-color: $bg-black;

    @include media(lg) {
      // Hide the navbar because it's positioned weirdly when opening the dialog for some reason
      nav {
        opacity: 0;
      }
    }
  }
}

.layout-wrapper {
  height: 100%;
  flex-grow: 1;
}

.layout-inner-wrapper {
  height: 100%;
  width: 100%;
  max-width: 192rem;
  flex-grow: 1;
}

.layout {
  flex-grow: 1;

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

.subtitle {
  opacity: 1;
  transition: opacity $page-transition-duration ease-in-out;
  transition-delay: $page-transition-duration;

  &.hidden {
    opacity: 0;
  }
}
</style>
