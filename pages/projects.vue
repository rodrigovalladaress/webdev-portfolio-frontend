<template>
  <div class="projects-wrapper">
    <div class="projects-border-wrapper">
      <h1 class="title">Projects</h1>

      <div class="cards-wrapper">
        <ProjectCard
          v-for="(p, key) in projects"
          :key="key"
          :project="p"
          :is-dialog-visible="id === p.id"
        ></ProjectCard>
      </div>

      <h1 class="title">Personal projects</h1>

      <div class="cards-wrapper">
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
  padding: var(--spacing-09);
  padding-block-start: 2rem;
  width: 100%;

  @media (--lg) {
    padding: var(--spacing-2);
  }
}

.projects-border-wrapper {
  @include media(lg) {
    padding: 40px;
    padding-bottom: 6.5rem;
    outline: white 1px solid;
    background-color: $bg-black-a-50;
    backdrop-filter: blur(2px);

    .h2 {
      padding-bottom: 3.5rem;
    }
  }
}

.title {
  font-size: var(--t-h4);
  font-weight: 600;
  padding-block-end: var(--spacing-1);

  /* Optical alignment */
  margin-inline-start: -0.145rem;

  &:last-of-type {
    padding-block-start: var(--spacing-3);
  }

  @media (--lg) {
    font-size: var(--t-h3);
    font-weight: 400;
  }
}

.cards-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 16px;
}
</style>
