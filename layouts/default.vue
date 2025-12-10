<template>
  <div class="default-layout">
    <div class="width-limiter">
      <header ref="header" class="header" :class="{ 'has-scrolled': hasScrolled }">
        <div class="header-spacing">
          <h1 class="title">
            <div class="name-wrapper">
              <div class="name" :class="{ 'one-line': !isHome }">Rodrigo <br class="d-none d-block-lg" /></div>

              <span class="surname">Valladares Santana</span>
            </div>

            <div class="subtitle" :class="{ hidden: isHome }">
              <div><span aria-hidden>/</span>Full-stack<br /></div>

              <div>/front-end developer</div>
            </div>
          </h1>

          <div class="nav-wrapper">
            <NavMenu></NavMenu>
          </div>
        </div>
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
.header {
  z-index: 10;
  transition: background-color 1000ms ease-out;

  &.has-scrolled {
    background-color: var(--color-bg-black);
    transition: background-color 500ms ease-out;
  }

  @media (--lg) {
    position: sticky;
    top: 0;
  }
}

// Dialog scroll fix (see _dialog-scroll-fix.scss and dialogScrollFix.ts)
body:has(dialog[open]) {
  .header {
    position: absolute;
    top: calc(var(--scroll-y-fix, 0) - var(--header-height, 0));
    width: 100%;
    background-color: var(--color-bg-black);

    @media (--lg) {
      // Hide the navbar because it's positioned weirdly
      // when opening the dialog for some reason
      nav {
        opacity: 0;
      }
    }
  }
}

.default-layout {
  min-height: 100dvh;
  display: flex;
  justify-content: center;
}

.width-limiter {
  width: 100%;
  max-width: 1920px;
  display: flex;
  flex-flow: column;
}

.header-spacing {
  display: flex;
  justify-content: space-between;

  /* Put the padding in the header-spacing instead of header so it doesn't
  interfere with sticky position */
  padding: var(--spacing-09);

  @media (--lg) {
    padding: var(--spacing-2);
  }
}

.title {
  text-transform: lowercase;
  font-weight: 600;
  background-color: oklch(var(--color-bg-black-value) / 80%);
  line-height: 1.1;

  // Optical alignment
  margin-block-start: -0.2rem;

  @media (--lg) {
    // Optical alignment
    margin-block-start: -0.8rem;
  }
}

.name-wrapper {
  font-size: var(--t-h3);

  @media (--lg) {
    font-size: var(--t-h1);
  }
}

.name {
  /* Optical alingment */
  margin-inline-start: -0.35rem;

  @media (--lg) {
    /* Optical alingment */
    margin-inline-start: -0.55rem;
  }
}

.surname {
  // Optical alignment
  margin-inline-start: -0.2rem;
  display: none;

  @media (--lg) {
    display: unset;

    // Optical alignment
    margin-inline-start: -0.3rem;
  }
}

.subtitle {
  padding-block-start: 0.8rem;
  font-size: var(--t-h5);
  font-weight: 400;
  opacity: 1;
  transition: opacity var(--page-transition-duration) ease-in-out;
  transition-delay: var(--page-transition-duration);

  // Optical alignment
  margin-inline-start: -0.2rem;

  &.hidden {
    opacity: 0;
  }

  @media (--lg) {
    display: flex;
    flex-wrap: wrap;

    // Optical alignment
    margin-inline-start: -0.25rem;
  }
}

.layout {
  flex-grow: 1;
  display: flex;
}

.h1 {
  line-height: 1.2;
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

  @media (--lg) {
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

  @media (--lg) {
    margin-top: 2rem;
  }
}
</style>
