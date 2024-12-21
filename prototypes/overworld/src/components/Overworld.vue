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

  const tabGroups = ref([
    [
      { id: 1, name: "Tab 1", content: "Content for Tab 1" },
      { id: 23, name: "Tab 2", content: "Content for Tab 2" }
    ],
    [
      { id: 3, name: "Tab 3", content: "Content for Tab 3" },
      { id: 44, name: "Tab 4", content: "Content for Tab 4" }
    ],
    [
      { id: 5, name: "Tab 5", content: "Content for Tab 5" },
      { id: 6, name: "Tab 6", content: "Content for Tab 6" }
    ]
  ]);
</script>

<style></style>
