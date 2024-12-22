<template>
  <TabGroup :selectedIndex="derivedIndex">
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
        @click.capture.stop="setTab(tab.id)"
        @mousedown.capture.stop
      >
        <div
          @mouseenter="showFix = index"
          @mouseleave="showFix = null"
        >
          <div>
            {{ tab.name }}
          </div>
          <XMarkIcon
            v-if="tab.closable !== false"
            class="ml-1 h-4 w-4 cursor-pointer hover:shadow-outer hover:rounded-lg"
            @click.stop="closeTab(index)"
          />
          <LockClosedIcon
            v-if="tab.fixable && !tab.fixed && showFix === index"
            class="ml-1 h-4 w-4 cursor-pointer hover:shadow-outer hover:rounded-lg"
            @click.stop="toggleFix(index)"
          />
          <LockOpenIcon
            v-if="tab.fixable && tab.fixed && showFix === index"
            class="ml-1 h-4 w-4 cursor-pointer hover:shadow-outer hover:rounded-lg"
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
          :key="index"
          class="h-6 w-6 hover:shadow-outer hover:rounded-lg"
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
        :key="tab.id"
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
  import { ref, onMounted, watch, computed, nextTick, onUnmounted } from "vue";
  import { useDraggable } from "vue-draggable-plus";
  import { XMarkIcon, LockClosedIcon, LockOpenIcon } from "@heroicons/vue/24/outline";

  type Identifier = number | string;

  type TabGroupDef = {
    id: Identifier;
    name: string;
    component: Component | (() => Component);
    closable?: boolean;
    fixable?: boolean;
    componentProps?: any;
  };

  type TabGroupDefInternal = TabGroupDef & { fixed?: boolean };

  const props = defineProps<{
    id: Identifier;
    tabs: TabGroupDef[];
    group?: string;
    buttons?: { icon: Component; action: "string" }[];
  }>();

  const emit = defineEmits(["action", "changeTab", "changeIndex"]);

  const draggable = ref<any>(null);
  const toDrag = ref<HTMLElement | null>(null);
  const items = ref<TabGroupDefInternal[]>(props.tabs);

  const firstElementId = () => {
    return items.value?.[0]?.id ?? null;
  };

  const selectedTab = ref(firstElementId());
  const showFix = ref<null | number>(null);

  const derivedIndex = computed(() => findIndexByTab(selectedTab.value));

  const findIndexByTab = (tab: Identifier) => {
    if (tab) {
      const index = items.value.findIndex((element) => element.id === tab);
      return index < 0 ? 0 : index;
    } else {
      return 0;
    }
  };

  const setTab = (id: Identifier) => {
    if (id === selectedTab.value) {
      emit("changeIndex", findIndexByTab(id));
    }
    selectedTab.value = id;
  };

  const closeTab = (index: number) => {
    items.value?.splice(index, 1);
    setTab(firstElementId());
  };

  const toggleFix = (index: number) => {
    const tab = items.value[index];
    tab.fixed = !tab.fixed;
  };

  const setDraggable = () => {
    draggable.value?.destroy();
    draggable.value = useDraggable(toDrag, items, {
      animation: 150,
      group: props.group,
      filter: ".non-draggable",
      async onRemove(event) {
        await nextTick();
        setTab(firstElementId(event?.data?.id));
      },
      async onSort(event) {
        const id = event?.data?.id;
        if (id) {
          if (items.value.find((tab) => tab.id === id)) {
            await nextTick();
            setTab(id);
          }
        }
      }
    });
  };

  watch(selectedTab, async (newValue) => {
    emit("changeTab", newValue);
  });

  watch(toDrag, (n) => {
    if (n) {
      setDraggable();
    }
  });

  onMounted(() => {});

  onUnmounted(() => {
    draggable.value?.destroy();
  });
</script>

<style scoped>
  .draggable-tab {
    cursor: grab;
  }
  .draggable-tab:active {
    cursor: grabbing;
  }
</style>
