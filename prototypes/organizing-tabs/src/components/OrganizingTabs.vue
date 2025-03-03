<template>
  <div
    ref="tabContainer"
    class="p-4 flex justify-center gap-4"
  >
    <div
      v-for="(tabGroup, index) in tabGroups"
      :key="tabGroup.id"
      :class="[
        index === 0 ? 'flex-1' : '',
        index === 1 ? 'basis-5/12' : '',
        index === 2 ? 'basis-4/12' : ''
      ]"
    >
      <DraggableTabs
        :id="tabGroup.id"
        :tabs="tabGroup.tabs"
        :group="'organizers'"
        :buttons="tabGroup.buttons"
        @action="executeAction($event.type)"
        @change-tab="activeTabs[tabGroup.id] = $event"
        @change-index="refreshTeleport"
      >
        <div :id="`${teleportConstant}-${teleportCounter}-${tabGroup.id}`" />
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
  import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/vue/24/outline";
  import type { Component } from "vue";
  import { inject, markRaw, provide, reactive, ref, watch } from "vue";
  import AddNotes from "./AddNotes.vue";
  import ClipboardView from "./ClipboardView.vue";
  import CreatedNotes from "./CreatedNotes.vue";
  import DraftsView from "./DraftsView.vue";
  import FolderView from "./FolderView.vue";
  import RecentNotes from "./RecentNotes.vue";
  import SearchView from "./SearchView.vue";
  import SelectionView from "./SelectionView.vue";
  import WritingArea from "./WritingArea.vue";
  // @ts-ignore path is not included in ts-config
  import { useOrganizingTabsStore } from "../../../../app/src/store/pinia-store"; //TODO: make import generic

  type TabActionTypes = "search" | "add-group";

  enum ComponentType {
    CLIPBOARD = "clipboard",
    SELECTION = "selection",
    ADD = "add",
    WRITE = "write",
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
      noPadding?: boolean;
      component: Component;
    };
  };

  const store = useOrganizingTabsStore();

  provide("draggable-group", inject("draggable-group") ?? "organizers");

  const tabMounted = ref(false);
  const tabContainer = ref();

  const teleportCounter = ref(1);
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
    [ComponentType.WRITE]: {
      name: "Write",
      deletable: false,
      noPadding: true,
      component: markRaw(WritingArea)
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
      closable: comp.deletable,
      noPadding: comp.noPadding
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
      tabs: [ComponentType.ADD, ComponentType.WRITE, ComponentType.SEARCH].map(createTabGroupDef),
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
      //buttons: []
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
    return `#${teleportConstant}-${teleportCounter.value}-${area ? area : ""}`;
  };

  const refreshTeleport = () => {
    // workaround because TabPanel in DraggableTabs destroys the slot on every items change and if selected-tab value
    // doesn't change there is no signal for an refresh
    teleportCounter.value += 1;
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
