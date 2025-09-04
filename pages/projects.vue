<template>
  <div class="projects-wrapper p-1 p-lg-2">
    <div class="projects-border-wrapper p-lg-2">
      <h1 class="h2 lowercase p-b-2">Projects</h1>

      <div class="cards-wrapper d-grid">
        <ProjectCard
          v-for="(p, key) in projects"
          :key="key"
          :project="p"
          :is-dialog-visible="id === p.id"
        ></ProjectCard>
      </div>

      <h1 class="h2 lowercase p-t-4 p-b-2">Personal projects</h1>

      <div class="cards-wrapper d-grid">
        <ProjectCard
          v-for="(p, key) in personalProjects"
          :key="key"
          :project="p"
          :is-dialog-visible="id === p.id"
        ></ProjectCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: "Projects",
  order: 1,
});

const route = useRoute();

const { data } = await useFetch("/api/project");

const projects = ref(data.value ? data.value.filter(({ type }) => type === "client") : []);
const personalProjects = ref(data.value ? data.value.filter(({ type }) => type === "personal") : []);

const id = computed(() => assureNotArray(route.query.id) ?? "");
</script>

<style lang="scss" scoped>
.projects-wrapper {
  padding-top: 2rem;
}

.projects-border-wrapper {
  @include media(lg) {
    padding: 4rem;
    padding-bottom: 6.5rem;
    outline: white 1px solid;
    background-color: $bg-black-a-50;
    backdrop-filter: blur(2px);

    .h2 {
      padding-bottom: 3.5rem;
    }
  }
}

.d-grid {
  grid-template-columns: 1fr;
  grid-auto-rows: minmax(15.5rem, auto);
  gap: 1rem;

  $desktop-card-size: 28.8rem;

  @include media(md) {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: $desktop-card-size;
  }

  @include media(lg) {
    grid-template-columns: repeat(3, 1fr);
  }

  @include media(xxl) {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
