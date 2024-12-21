<template>
  <div class="p-4 flex justify-center gap-4">
    <div v-for="(tabGroup, index) in tabGroups" :key="index" class="flex-1" >
      <DraggableTabs :tabs="tabGroup" :group="'organizers'" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { DraggableTabs } from "@artefacts/components";
  import { ref } from "vue";
  import Test from "./Test.vue";

  const tabGroups = ref([
    [
      { id: 1, name: "Tab 1", component: Test },
      { id: 23, name: "Tab 2", component: Test }
    ],
    [
      { id: 3, name: "Tab 3", component: Test },
      { id: 44, name: "Tab 4", component: Test }
    ],
    [
      { id: 5, name: "Tab 5", component: Test },
      { id: 6, name: "Tab 6", component: Test }
    ]
  ]);
</script>

<style></style>
