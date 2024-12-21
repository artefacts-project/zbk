<template>
  <TabGroup :selectedIndex="selectedTab" @change="changeTab">
    <TabList role="tablist" ref="toDrag" class="flex tabs tabs-lifted w-full h-8">
      <Tab v-for="(tab, index) in items" :key="index" role="tab" as="template" class="draggable-tab tab">
        <div @mousedown.capture.stop @click.capture.stop="setTab(tab.id)">{{ tab.name }}</div>
      </Tab>
      <div class="flex-1 tab additional-space-tab" />
    </TabList>
    <TabPanels>
      <TabPanel v-for="(tab, index) in items" :key="index" class="p-4 tab-border">
        {{ tab.content }}
      </TabPanel>
    </TabPanels>
  </TabGroup>
</template>

<script setup lang="ts">
  import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/vue";
  import { onMounted, ref } from "vue";
  import { useDraggable } from "vue-draggable-plus";

  type TabGroupDef = { id: number; name: string; content: string }[];

  const props = defineProps<{ tabs: TabGroupDef; group?: string }>();

  const toDrag = ref<HTMLElement | null>(null);

  const items = ref(props.tabs);

  const selectedTab = ref(0);

  function setTab(id: number) {
    selectedTab.value = items.value.findIndex((tab) => tab.id === id);
  }

  function changeTab(index: number) {
    selectedTab.value = index;
  }

  const draggable = useDraggable(toDrag, items, {
    animation: 150,
    onStart(event) {
      if (event?.data?.id) {
        setTab(event.data.id);
      }
    },
    onUpdate(event) {
      if (event?.data?.id) {
        setTab(event.data.id);
      }
    },
    onAdd(event) {
      //TODO: some reactivity bug when adding tab to another tabgroup
      if (event?.data?.id) {
        setTab(event.data.id);
      }
    },
    onRemove(event) {
      if (event.oldIndex === 0) {
        changeTab(0);
      } else {
        changeTab((event?.oldIndex ?? 1) - 1);
      }
    },
    group: props.group
  });

  onMounted(() => {});
</script>

<style scoped>
  .draggable-tab {
    cursor: grab;
    --draggable-tabs-border-color: var(--tab-border-color);
  }
  .draggable-tab:active {
    cursor: grabbing;
  }
</style>
