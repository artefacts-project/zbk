<template>
  <div
    ref="tabContainer"
    class="p-4 flex justify-center gap-4"
  >
    <div
      v-for="(tabGroup, index) in tabGroups"
      :key="tabGroup.id"
      class="flex-1"
    >
      <DraggableTabs
        :tabs="tabGroup.tabs"
        :group="'organizers'"
        :buttons="tabGroup.buttons"
        @action="executeAction($event.type)"
        @change-tab="tabGroup.activeTab = $event"
      >
        <div :id="`overworld-${tabGroup.id}`" />
      </DraggableTabs>
    </div>
  </div>
  <div
    v-if="tabMounted"
    v-for="(value, tabKey) in tabs"
    class="hidden"
    :key="tabKey"
  >
    <Teleport
      :disabled="!canTeleport(tabKey)"
      :to="teleportTo(tabKey)"
    >
      <KeepAlive>
        <component
          :is="tabs[tabKey].component"
          :key="tabKey"
        />
      </KeepAlive>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import { DraggableTabs } from "@artefacts/components";
  import { markRaw, ref, watch } from "vue";
  import type { Component } from "vue";
  import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/vue/24/outline";
  import ClipboardView from "./ClipboardView.vue";
  import SelectionView from "./SelectionView.vue";
  import AddNotes from "./AddNotes.vue";
  import SearchView from "./SearchView.vue";
  import RecentNotes from "./RecentNotes.vue";
  import DraftsView from "./DraftsView.vue";
  import CreatedNotes from "./CreatedNotes.vue";
  import FolderView from "./FolderView.vue";

  type TabActionTypes = "search" | "add-group";

  enum ComponentType {
    CLIPBOARD = "clipboard",
    SELECTION = "selection",
    ADD = "add",
    RECENT = "recent",
    DRAFTS = "drafts",
    CREATED = "created",
    FOLDER = "folder"
  }

  type TabDef = {
    [key in ComponentType]: {
      name: string;
      deletable?: boolean;
      component: Component;
    };
  };

  const tabMounted = ref(false);
  const tabContainer = ref();

  const tabs = ref<TabDef>({
    [ComponentType.CLIPBOARD]: {
      name: "Clipboard",
      deletable: false,
      component: markRaw(ClipboardView)
    },
    [ComponentType.SELECTION]: {
      name: "Selection",
      deletable: false,
      component: markRaw(SelectionView)
    },
    [ComponentType.ADD]: {
      name: "Add",
      deletable: false,
      component: markRaw(AddNotes)
    },
    [ComponentType.RECENT]: {
      name: "Recent",
      deletable: false,
      component: markRaw(RecentNotes)
    },
    [ComponentType.DRAFTS]: {
      name: "Drafts",
      deletable: false,
      component: markRaw(DraftsView)
    },
    [ComponentType.CREATED]: {
      name: "Created",
      deletable: false,
      component: markRaw(CreatedNotes)
    },
    [ComponentType.FOLDER]: {
      name: "Directory",
      deletable: false,
      component: markRaw(FolderView)
    }
  });

  const createTabGroupDef = (componentId: ComponentType) => {
    const comp = tabs.value[componentId];
    return {
      id: componentId,
      name: comp.name,
      closable: comp.deletable
      //fixable
    };
  };

  const tabGroups = ref([
    {
      id: "sharing",
      activeTab: ComponentType.CLIPBOARD,
      tabs: [ComponentType.CLIPBOARD, ComponentType.SELECTION].map(createTabGroupDef),
      buttons: [
        { icon: MagnifyingGlassIcon, action: "search" },
        { icon: PlusIcon, action: "add-group" }
      ]
    },
    {
      id: "creating",
      activeTab: ComponentType.ADD,
      tabs: [ComponentType.ADD].map(createTabGroupDef),
      buttons: [
        { icon: MagnifyingGlassIcon, action: "search" },
        { icon: PlusIcon, action: "add-group" }
      ]
    },
    {
      id: "navigating",
      activeTab: ComponentType.RECENT,
      tabs: [
        ComponentType.RECENT,
        ComponentType.DRAFTS,
        ComponentType.CREATED,
        ComponentType.FOLDER
      ].map(createTabGroupDef)
    }
  ]);

  const canTeleport = (comp: ComponentType) => {
    return !!tabGroups.value.find((group) => group.activeTab === comp);
  };

  const teleportTo = (comp: ComponentType) => {
    return `#overworld-${tabGroups.value.find((group) => group.activeTab === comp)?.id ?? ""}`;
  };

  watch(tabContainer, (newValue) => {
    if (newValue) {
      tabMounted.value = true;
    }
  });

  const executeAction = (action: TabActionTypes) => {
    console.log(action);
  };
</script>

<style></style>
