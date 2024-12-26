<template>
  <div
    @dblclick="select"
    class="flex flex-col shadow rounded-xl bg-primary-content"
  >
    <SimpleEditor
      class="p-2"
      @changed="onChange"
    />
    <div class="flex justify-end p-1">
      <button
        @click="create()"
        class="btn btn-sm border-0 shadow-none bg-transparent hover:bg-base-200"
      >
        <PencilIcon class="h-4" />
        Create
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ZettelService } from "@artefacts/core";
  import { ref } from "vue";
  import SimpleEditor from "../editor/SimpleEditor.vue";
  import { PencilIcon } from "@heroicons/vue/24/outline";

  const props = defineProps<{
    zettel: ZettelService;
  }>();

  const emit = defineEmits<{
    create: [];
    select: [];
  }>();

  const content = ref([]);

  const onChange = (data: string[]) => {
    props.zettel.setContent(data);
  };

  const create = () => {
    emit("create");
  };

  const select = () => {
    emit("select");
  };
</script>

<style scoped></style>
