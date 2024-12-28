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
        @create="$emit('create', zettel)"
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

  const emit = defineEmits<{
    create: [ZettelService];
  }>();

  const list = ref<ZettelService[]>(props.list);
  const addNewZettel = () => {
    list.value.push(new ZettelService());
  };
</script>

<style scoped></style>
