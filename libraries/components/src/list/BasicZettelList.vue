<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-center">
      <AddZettelControl
        v-if="showAddControl"
        class="mb-4"
        @add="addNewZettel"
      />
    </div>
    <div ref="draggableContainer">
      <div
        v-for="zettel in displayedList"
        :key="zettel.id"
      >
        <NewZettel
          v-if="list.zettel(zettel.id).isDraft"
          class="my-2"
          :custom-id="zettel.id"
          :zettel="list.zettel(zettel.id)"
          @create="$emit('create', list.zettel(zettel.id))"
        />

        <div
          v-else
          :custom-id="zettel.id"
        >
          {{ list.zettel(zettel.id).isDraft }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ListService, ZettelService } from "@artefacts/core";
  import { inject, onMounted, onUnmounted, ref, watch } from "vue";
  import { DraggableEvent, useDraggable, UseDraggableReturn } from "vue-draggable-plus";
  import AddZettelControl from "../zettel/AddZettelControl.vue";
  import NewZettel from "../zettel/NewZettel.vue";

  type Props = { list?: ListService; showAddControl?: boolean };

  const props = withDefaults(defineProps<Props>(), {
    list: () => new ListService(),
    showAddControl: false
  });

  const emit = defineEmits<{
    create: [ZettelService];
  }>();

  const draggableGroupIdentifier = inject<string>("draggable-group");

  const draggableContainer = ref<HTMLElement>();
  const draggable = ref<UseDraggableReturn>();

  const displayedList = ref<ZettelService[]>([]); // used for sortableJS
  const list = new ListService(props.list);

  const updateUIList = () => {
    displayedList.value = list.asArray;
  };

  const addNewZettel = () => {
    const zettel = new ZettelService();
    list.addToList(zettel);
    updateUIList();
  };

  const setDraggable = () => {
    draggable.value = useDraggable(draggableContainer, displayedList, {
      animation: 150,
      group: draggableGroupIdentifier,
      dataIdAttr: "custom-id",
      filter: ".non-draggable",

      async onRemove(e) {
        const event = e as DraggableEvent;
        if (event.data) {
          list.removeFromListById(event.data.uid);
          updateUIList();
        }
      },
      async onAdd(e) {
        const event = e as DraggableEvent;
        if (event.data) {
          list.addToList(event.data, event.newIndex);
          updateUIList();
        }
      }
    });
  };

  watch(draggableContainer, (n) => {
    if (n) {
      setDraggable();
    }
  });

  onMounted(() => {
    updateUIList();
  });

  onUnmounted(() => {
    draggable.value?.destroy();
  });
</script>

<style scoped></style>
