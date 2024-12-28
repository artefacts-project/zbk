<template>
  <div>
    <BasicZettelList
      :show-add-control="true"
      @create="dispatch.createNewZettel($event)"
    />
  </div>
</template>

<script lang="ts" setup>
  import { BasicZettelList } from "@artefacts/components";
  import { useStore } from "@artefacts/core";

  const { dispatch } = useStore();
</script>

<style scoped></style>
