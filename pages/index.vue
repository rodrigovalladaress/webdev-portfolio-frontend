<template>
  <div class="home-wrapper">
    <div class="title-color-switcher-wrapper">
      <div class="title-color-box-wrapper">
        <div class="title-wrapper">
          <h2 class="title">
            <span aria-hidden>/</span>Full-stack <br />
            /front-end developer
          </h2>
        </div>

        <div class="color-box" />
      </div>

      <div class="color-switcher-wrapper">
        <ColorSwitcher />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: "Home",
  order: 0,
});
</script>

<style lang="scss" scoped>
.home-wrapper {
  --color-box-height: 4px;

  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  gap: var(--spacing-1, 1rem);
}

.title-color-switcher-wrapper {
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-direction: column;

  @media (--lg) {
    flex-direction: row;
  }
}

.color-switcher-wrapper {
  padding-block-end: var(--color-box-height);

  @media (--lg) {
    padding-inline-end: var(--spacing-1);
  }
}

.title-wrapper {
  width: fit-content;
  padding: var(--spacing-1);
  background-color: oklch(var(--color-bg-black-value) / 70%);
  backdrop-filter: blur(2px);
}

@keyframes moveBackground {
  0% {
    background-position: 0%;
  }
  100% {
    background-position: 200%;
  }
}

.color-box {
  height: var(--color-box-height);
  border-color: oklch(var(--color-primary-value));
  background: linear-gradient(
    to left,
    oklch(calc(var(--color-primary-l) * 0.5) calc(var(--color-primary-c) * 0.7) var(--color-primary-h) / 80%),
    oklch(var(--color-primary-l) calc(var(--color-primary-c) * 1.5) var(--color-primary-h) / 80%),
    oklch(calc(var(--color-primary-l) * 0.5) calc(var(--color-primary-c) * 0.7) var(--color-primary-h) / 80%)
  );
  background-size: 200% 100%;
  animation: moveBackground 30s linear infinite;
}

.title {
  font-size: var(--t-h2);
  text-transform: lowercase;
  font-family: var(--font-mono);
}
</style>
