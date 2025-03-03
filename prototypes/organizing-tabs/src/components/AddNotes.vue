<template>
  <div>
    <BasicZettelList
      :show-add-control="true"
    />
  </div>
</template>

<script lang="ts" setup>
  import { BasicZettelList } from "@artefacts/components";
  // @ts-ignore path is not included in ts-config
  import { useStore } from "../../../../app/src/store/pinia-store"; //TODO: make import generic

  const store = useStore();
</script>

<style scoped></style>
