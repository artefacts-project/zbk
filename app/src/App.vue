<template>
  <header><top-navigation /></header>
  <router-view></router-view>
</template>

<script lang="ts" setup>
  import { onMounted, provide } from "vue";
  import TopNavigation from "./components/TopNavigation.vue";


  provide("draggable-group", "zbk");


  onMounted(() => {});
</script>

<style scoped></style>
