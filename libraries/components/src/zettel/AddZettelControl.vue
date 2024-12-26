<template>
  <BaseButton @click="addNew()">
    <PlusCircleIcon class="h-6 w-6" />
    Add a Zettel
  </BaseButton>
</template>

<script lang="ts" setup>
  import { PlusCircleIcon } from "@heroicons/vue/24/outline";
  import BaseButton from "../base/BaseButton.vue";

  const emit = defineEmits<{
    add: any;
  }>();

  const addNew = () => {
    emit("add");
  };
</script>

<style scoped></style>
