<template>
  <div class="p-4 flex justify-center gap-4">
    <div
      v-for="(tabGroup, index) in tabGroups"
      :key="index"
      class="flex-1"
    >
      <DraggableTabs
        :tabs="tabGroup.tabs"
        :group="'organizers'"
        :buttons="tabGroup.buttons"
        @action="executeAction($event.type)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { DraggableTabs } from "@artefacts/components";
  import { ref } from "vue";
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

  const tabGroups = ref([
    {
      id: "sharing",
      tabs: [
        { id: "clipboard", name: "Clipboard", component: ClipboardView, closable: false },
        { id: "selection", name: "Selection", component: SelectionView, closable: false }
      ],
      buttons: [
        { icon: MagnifyingGlassIcon, action: "search" },
        { icon: PlusIcon, action: "add-group" }
      ]
    },
    {
      id: "creating",
      tabs: [
        { id: "add", name: "Add", component: AddNotes, closable: false },
        { id: "search-0", name: "Search", component: SearchView }
      ],
      buttons: [
        { icon: MagnifyingGlassIcon, action: "search" },
        { icon: PlusIcon, action: "add-group" }
      ]
    },
    {
      id: "navigating",
      tabs: [
        { id: "recent", name: "Recent", component: RecentNotes, closable: false },
        { id: "drafts", name: "Drafts", component: DraftsView, closable: false },
        { id: "created", name: "Created", component: CreatedNotes, closable: false },
        { id: "folder", name: "Directory", component: FolderView, closable: false }
      ]
    }
  ]);

  const executeAction = (action: TabActionTypes) => {
    console.log(action);
  };
</script>

<style></style>
