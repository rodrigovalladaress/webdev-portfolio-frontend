<template>
  <div>
    <h1>Welcome to the homepage (that is a page)</h1>

    <AppAlert> This is an auto-imported component </AppAlert>

    <NuxtLink to="/about">About</NuxtLink>

    <div v-if="data">
      <div v-for="(d, i) in data.projects.data" :key="i">{{ d.id }} - {{ d.attributes.name }}</div>
    </div>
    <div v-else>WAITING FOR DATA</div>

    <div>PROJECT: {{ project }}</div>
  </div>
</template>

<script lang="ts" setup>
const query = gql`
  query getProjects {
    projects {
      data {
        id
        attributes {
          name
          description
          images {
            data {
              attributes {
                name
                url
              }
            }
          }
          skill_tags
        }
      }
    }
  }
`;

const project = ref<any>({});

type Project = {
  id: string;
  attributes: { name: string; description: string };
};

const { data, execute } = await useAsyncQuery<{
  projects: {
    data: Project[];
  };
}>(query, {});

execute();

console.log("data", data);
</script>

<style lang="scss">
h1 {
  color: $primary;

  // border: 1rem;
}
</style>
