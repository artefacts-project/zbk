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
        :id="tabGroup.id"
        :tabs="tabGroup.tabs"
        :group="'organizers'"
        :buttons="tabGroup.buttons"
        @action="executeAction($event.type)"
        @change-tab="activeTabs[tabGroup.id] = $event"
        @change-index="teleportId += 1"
      >
        <div :id="`${teleportConstant}-${teleportId}-${tabGroup.id}`" />
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
  import { markRaw, nextTick, reactive, ref, watch } from "vue";
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
    FOLDER = "folder",
    SEARCH = "search"
  }

  enum AreaType {
    SHARING = "sharing",
    CREATING = "creating",
    NAVIGATING = "navigating"
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

  const teleportId = ref(1);
  const teleportConstant = "organizer";

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
    },
    [ComponentType.SEARCH]: {
      name: "Search",
      deletable: true,
      component: markRaw(SearchView)
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
      id: AreaType.SHARING,
      activeTab: ComponentType.CLIPBOARD,
      tabs: [ComponentType.CLIPBOARD, ComponentType.SELECTION].map(createTabGroupDef),
      buttons: [
        { icon: MagnifyingGlassIcon, action: "search" },
        { icon: PlusIcon, action: "add-group" }
      ]
    },
    {
      id: AreaType.CREATING,
      activeTab: ComponentType.ADD,
      tabs: [ComponentType.ADD, ComponentType.SEARCH].map(createTabGroupDef),
      buttons: [
        { icon: MagnifyingGlassIcon, action: "search" },
        { icon: PlusIcon, action: "add-group" }
      ]
    },
    {
      id: AreaType.NAVIGATING,
      activeTab: ComponentType.RECENT,
      tabs: [
        ComponentType.RECENT,
        ComponentType.DRAFTS,
        ComponentType.CREATED,
        ComponentType.FOLDER
      ].map(createTabGroupDef)
    }
  ]);

  const activeTabs = reactive({
    [AreaType.SHARING]: ComponentType.CLIPBOARD,
    [AreaType.CREATING]: ComponentType.ADD,
    [AreaType.NAVIGATING]: ComponentType.RECENT
  });

  const findArea = (comp: ComponentType) => {
    for (const [key, value] of Object.entries(activeTabs)) {
      try {
        if (value && value.includes(comp)) {
          return key;
        }
      } catch (e) {
        //TODO: add error handling
        return null;
      }
    }
    return null;
  };

  const canTeleport = (comp: ComponentType) => {
    return !!findArea(comp);
  };

  const teleportTo = (comp: ComponentType) => {
    const area = findArea(comp);
    return `#${teleportConstant}-${teleportId.value}-${area ? area : ""}`;
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
