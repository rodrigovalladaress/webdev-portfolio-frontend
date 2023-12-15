<template>
  <div class="projects-wrapper">
    <h1 class="h2 p-b-2">Projects</h1>

    <div class="cards-wrapper d-grid">
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
}

.d-grid {
  grid-template-columns: 1fr;
  grid-auto-rows: minmax(15.5rem, auto);
  gap: 1rem;

  // grid: repeat(15.5rem 1fr / 1fr);
}
</style>
