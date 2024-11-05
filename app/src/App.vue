<template>
  <header><top-navigation /></header>
  <router-view></router-view>
</template>

<script lang="ts" setup>
  import { onMounted } from "vue";
  import TopNavigation from "./components/TopNavigation.vue";

  onMounted(() => {});
</script>

<style scoped></style>
