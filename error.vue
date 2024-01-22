<template>
  <NuxtLayout>
    <div v-if="error" class="error-page d-flex column justify-content-center align-items-center p-1 p-lg-2">
      <h1 v-if="error.statusCode">{{ error.statusCode }}</h1>

      <h1 v-else>Something wrong happened</h1>

      <p class="error-message">
        <strong v-if="error.message">{{ error.message }}</strong>
        <strong v-else>{{ error }}</strong>
      </p>

      <div class="actions">
        <a class="btn" @click="handleError">Go to home page</a>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
defineProps({
  // eslint-disable-next-line vue/require-default-prop
  error: Object,
});

const handleError = () => {
  clearError();

  // Force a page refresh because clearError and
  // redirect is not working for some reason
  window.location.href = "/";
};
</script>

<style lang="scss" scoped>
h1 {
  font-size: 8rem;
}

.actions {
  margin-top: 6rem;
}
</style>
