<template>
  <TabGroup :selectedIndex="derivedIndex">
    <TabList
      role="tablist"
      ref="toDrag"
      class="tabs tabs-lift"
    >
      <!-- workaround: using only id or index does not work, probably rerender needs to guaranteed -->
      <Tab
        v-for="(tab, index) in tabItems"
        :key="`${tab.id}-${index}`"
        role="tab"
        as="template"
        :custom-id="tab.id"
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
        v-for="(tab, index) in tabItems"
        :key="`${tab.id}-${index}`"
        :class="{ 'p-4': tab.noPadding !== true }"
      >
        <slot />
      </TabPanel>
    </TabPanels>
  </TabGroup>
</template>

<script setup lang="ts">
  import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/vue";
  import { LockClosedIcon, LockOpenIcon, XMarkIcon } from "@heroicons/vue/24/outline";
  import type { FunctionalComponent } from "vue";
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
  import { useDraggable } from "vue-draggable-plus";

  type Identifier = number | string;

  type TabGroupDef = {
    id: Identifier;
    name: string;
    closable?: boolean;
    fixable?: boolean;
    componentProps?: any;
    noPadding?: boolean;
  };

  type TabGroupDefInternal = TabGroupDef & { fixed?: boolean };

  const props = defineProps<{
    id: Identifier;
    tabs: TabGroupDef[];
    group?: string;
    buttons?: { icon: FunctionalComponent; action: string }[];
  }>();

  const emit = defineEmits(["action", "changeTab", "changeIndex"]);

  const draggable = ref<any>(null);
  const toDrag = ref<HTMLElement | null>(null);
  const tabItems = ref<TabGroupDefInternal[]>(props.tabs);

  const firstElementId = () => {
    return tabItems.value?.[0]?.id ?? null;
  };

  const selectedTab = ref(firstElementId());
  const showFix = ref<null | number>(null);

  const derivedIndex = computed(() => findIndexByTab(selectedTab.value));

  const findIndexByTab = (tab: Identifier) => {
    if (tab) {
      const index = tabItems.value.findIndex((element) => element.id === tab);
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
    tabItems.value?.splice(index, 1);
    setTab(firstElementId());
  };

  const toggleFix = (index: number) => {
    const tab = tabItems.value[index];
    tab.fixed = !tab.fixed;
  };

  const setDraggable = () => {
    draggable.value?.destroy();
    draggable.value = useDraggable(toDrag, tabItems, {
      //dataIdAttr: "custom-id",
      animation: 150,
      group: props.group,
      filter: ".non-draggable",
      async onRemove(event) {
        await nextTick();
        //TODO: use event info to set the next tab in line as active tab
        setTab(firstElementId());
      },
      async onSort(event) {
        // @ts-ignore data does not exist on SortableEvent
        const id = event?.data?.id;
        if (id) {
          if (tabItems.value.find((tab) => tab.id === id)) {
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
  .sortable-drag {
    opacity: 0;
  }
</style>
