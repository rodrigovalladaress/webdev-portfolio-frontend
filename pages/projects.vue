<template>
  <div class="projects-wrapper">
    <h1 class="h2 lowercase p-b-2">Projects</h1>

    <ImageCarousel></ImageCarousel>

    <div class="cards-wrapper d-grid">
      <ProjectCard></ProjectCard>
      <ProjectCard></ProjectCard>
      <ProjectCard></ProjectCard>
      <ProjectCard></ProjectCard>
      <ProjectCard></ProjectCard>
      <ProjectCard></ProjectCard>
      <ProjectCard></ProjectCard>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.projects-wrapper {
  padding-top: 2rem;
  background-color: green;

  @include media(lg) {
    padding: 4rem;
    padding-bottom: 6.5rem;
    outline: white 1px solid;
    background-color: $bg-black-a-50;

    .h2 {
      padding-bottom: 4.5rem;
    }
  }
}

.d-grid {
  grid-template-columns: 1fr;
  grid-auto-rows: minmax(15.5rem, auto);
  gap: 1rem;

  @include media(lg) {
    $card-size: 28.8rem;

    grid-template-columns: repeat(auto-fit, minmax($card-size, auto));
    grid-auto-rows: $card-size;
    gap: 0.9rem;
  }
}
</style>
