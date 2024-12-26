<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-center">
      <AddZettelControl
        v-if="showAddControl"
        class="mb-4"
        @add="addNewZettel"
      />
    </div>
    <div v-for="(zettel, index) in list">
      <NewZettel
        v-if="zettel.isNew"
        class="my-2"
        :zettel="zettel"
        @create="finishDraft(index)"
      />

      <div v-else>
        {{ zettel.asString() }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ZettelService } from "@artefacts/core";
  import AddZettelControl from "../zettel/AddZettelControl.vue";
  import { ref } from "vue";
  import NewZettel from "../zettel/NewZettel.vue";

  type Props = { list?: ZettelService[]; showAddControl?: boolean };

  const props = withDefaults(defineProps<Props>(), {
    list: () => [],
    showAddControl: false
  });

  const list = ref<ZettelService[]>(props.list);
  const addNewZettel = () => {
    list.value.push(new ZettelService());
  };

  const finishDraft = (index: number) => {
    list.value[index].finishDraft();
  };
</script>

<style scoped></style>
