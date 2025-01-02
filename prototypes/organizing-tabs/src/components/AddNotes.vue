<template>
  <div>
    <BasicZettelList
      :show-add-control="true"
      @create="store.dispatch.createNewZettel($event)"
    />
  </div>
</template>

<script lang="ts" setup>
  import { BasicZettelList } from "@artefacts/components";
  import { useStore } from "../../../../app/src/store/pinia-store"; //TODO: make import generic

  const store = useStore();
</script>

<style scoped></style>
