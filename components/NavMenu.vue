<template>
  <nav class="nav">
    <ul>
      <li v-for="({ label, href }, i) in items" :key="i">
        <NuxtLink class="link" :to="href" active-class="active" @click="onClick">
          {{ label }}
        </NuxtLink>

        <span v-if="i != items.length - 1" aria-hidden class="separator">/</span>
      </li>
    </ul>
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
  document.documentElement.classList.add("overflow-x-hidden");

  (document.activeElement as HTMLElement).blur();
};
</script>

<style lang="css" scoped>
.nav {
  width: 100%;
}

ul {
  --spacing: 0;

  display: flex;
  position: fixed;
  left: 0;
  bottom: 0;
  height: 4.625rem;
  width: 100%;
  font-family: var(--font-mono);
  text-transform: lowercase;
  background-color: oklch(var(--color-bg-black-value) / 90%);
  font-size: var(--t-h6);
  line-height: 1;
  gap: var(--spacing);

  @media (--lg) {
    --spacing: 0.5rem;

    position: inherit;
    height: fit-content;
    line-height: 1.4;
    font-size: var(--t-h5);
    width: auto;
    display: flex;
    justify-content: flex-end;
  }

  /* Style for very small screens */
  @media (width < 320px) {
    flex-wrap: wrap;
    height: inherit;

    li {
      flex: 1 1 100%;
      padding: 0.9rem 0;
    }
  }
}

li {
  flex: 1;
  display: flex;
  gap: var(--spacing);
}

.link {
  width: 100%;
  display: grid;
  place-items: center;
  color: var(--color-text);
  font-weight: 600;

  @media (--lg) {
    --transition-duration: 250ms;

    height: auto;
    position: relative;
    z-index: 0;
    transition: color var(--transition-duration) ease-in-out;

    &::before {
      content: "";
      position: absolute;
      z-index: -1;
      background-color: oklch(var(--color-text-value) / 30%);
      width: 100%;
      height: 100%;
      transform-origin: 0% 50%;
      transform: scale(0%, 100%);
      transition:
        background-color var(--transition-duration) ease-in-out,
        transform var(--transition-duration) ease-in-out;
    }

    &:hover {
      color: #000;
      text-decoration: none;

      &::before {
        background-color: var(--color-text);
        transform: scale(100%, 100%);
      }
    }

    &:focus:not(:active) {
      border: none;
      outline: 2px var(--color-text) dashed;
    }
  }
}

.separator {
  display: none;

  @media (--lg) {
    display: initial;
  }
}
</style>

<style lang="css">
.nav {
  a.active {
    /* Don't use text-decoration, as it's not correctly
    updated with the .active class for some reason */
    color: #000;
    background-color: var(--color-text);
    pointer-events: none;
  }
}
</style>
