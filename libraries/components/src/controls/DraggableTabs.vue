<template>
  <TabGroup
    :selectedIndex="selectedTab"
    @change="changeTab"
  >
    <TabList
      role="tablist"
      ref="toDrag"
      class="tabs tabs-lifted"
    >
      <Tab
        v-for="(tab, index) in items"
        :key="index"
        role="tab"
        as="template"
        class="draggable-tab tab"
      >
        <div
          @mouseenter="showFix = index"
          @mouseleave="showFix = null"
        >
          <div
            @mousedown.capture.stop
            @click.capture.stop="setTab(tab.id)"
          >
            {{ tab.name }}
          </div>
          <XMarkIcon
            v-if="tab.closable !== false"
            class="ml-1 h-4 w-4 cursor-pointer hover:shadow-inner hover:rounded-lg"
            @click.stop="closeTab(index)"
          />
          <LockClosedIcon
            v-if="tab.fixable && !tab.fixed && showFix === index"
            class="ml-1 h-4 w-4 cursor-pointer hover:shadow-inner hover:rounded-lg"
            @click.stop="toggleFix(index)"
          />
          <LockOpenIcon
            v-if="tab.fixable && tab.fixed && showFix === index"
            class="ml-1 h-4 w-4 cursor-pointer hover:shadow-inner hover:rounded-lg"
            @click.stop="toggleFix(index)"
          />
        </div>
      </Tab>
      <div
        v-if="buttons"
        role="tab"
        class="tab non-draggable cursor-pointer"
      >
        <button
          v-for="(button, index) in buttons"
          :key="`add-btn-${index}`"
          class="h-6 w-6 hover:shadow-inner hover:rounded-lg"
          :class="index !== 0 ? 'ml-2' : ''"
          @click="$emit('action', { type: button.action })"
        >
          <component
            :is="button.icon"
            class="h-4 w-4 relative left-1"
          />
        </button>
      </div>
      <div class="tab additional-space-tab"></div>
    </TabList>
    <TabPanels>
      <TabPanel
        v-for="(tab, index) in items"
        :key="index"
        class="p-4"
      >
        <slot />
      </TabPanel>
    </TabPanels>
  </TabGroup>
</template>

<script setup lang="ts">
  import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/vue";
  import type { Component } from "vue";
  import { ref, onMounted, watch } from "vue";
  import { useDraggable } from "vue-draggable-plus";
  import { XMarkIcon, LockClosedIcon, LockOpenIcon } from "@heroicons/vue/24/outline";

  type TabGroupDef = {
    id: number | string;
    name: string;
    component: Component | (() => Component);
    closable?: boolean;
    fixable?: boolean;
    componentProps?: any;
  }[];

  type TabGroupDefInternal = TabGroupDef & { fixed?: boolean };

  const props = defineProps<{
    tabs: TabGroupDef;
    group?: string;
    buttons?: { icon: Component; action: "string" }[];
  }>();

  const emit = defineEmits(["action", "changeTab"]);

  const toDrag = ref<HTMLElement | null>(null);
  const items = ref<TabGroupDefInternal>(props.tabs);
  const selectedTab = ref(0);
  const showFix = ref<null | number>(null);

  const findTabByIndex = (index: number) => {
    return items.value[index];
  };

  function setTab(id: number) {
    selectedTab.value = items.value.findIndex((tab) => tab.id === id);
  }

  function changeTab(index: number) {
    selectedTab.value = index;
  }

  function closeTab(index: number) {
    items.value.splice(index, 1);
    if (selectedTab.value >= items.value.length) {
      selectedTab.value = items.value.length - 1;
    }
  }

  function toggleFix(index: number) {
    const tab = items.value[index];
    tab.fixed = !tab.fixed;
  }

  const draggable = useDraggable(toDrag, items, {
    animation: 150,
    group: props.group,
    filter: ".non-draggable",
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
    onSort(event) {
      if (event?.data?.id) {
        if (items.value.find((tab) => tab.id === event.data.id)) {
          setTab(event.data.id);
        }
      }
    }
  });

  watch(selectedTab, (newValue) => {
    emit("changeTab", findTabByIndex(newValue).id);
  });

  onMounted(() => {});
</script>

<style scoped>
  .draggable-tab {
    cursor: grab;
  }
  .draggable-tab:active {
    cursor: grabbing;
  }
</style>
