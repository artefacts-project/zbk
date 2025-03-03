<template>
  <div
    @dblclick="select"
    class="flex flex-col shadow rounded-xl bg-primary-content"
  >
    <SimpleEditor
      class="p-2"
      :editor-events="editorEvents"
      :content="content"
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
  import { ref, watch } from "vue";
  import SimpleEditor from "../editor/SimpleEditor.vue";
  import { PencilIcon } from "@heroicons/vue/24/outline";
  import { EditorEvents, Insertion } from "../editor/editor-types";

  const props = defineProps<{
    zettel: ZettelService;
  }>();

  const emit = defineEmits<{
    create: [];
    select: [];
  }>();

  const clearWithContent = (content: string[]) => {
    const insertions: Insertion[] = content.map((text) => ({
      type: "paragraph",
      data: { text }
    }));

    return insertions;
  };

  const callbacks: any = {
    onClearAndReset: null,
    onInsert: null,
    onUpdate: null
  }

  const editorEvents: EditorEvents = {
    onClearAndReset: (cb) => callbacks.onClearAndReset = cb,
    onInsert: (cb) => callbacks.onInsert = cb,
    onUpdate: (cb) => callbacks.onUpdate = cb
  };

  const onChange = (data: string[]) => {
    props.zettel.setContent(data);
  };

  const create = () => {
    emit("create");
  };

  const select = () => {
    emit("select");
  };

  const content = ref(props.zettel.asString);

  watch(
    () => props.zettel,
    (zettel) => {
      callbacks.onClearAndReset?.(clearWithContent(zettel.asArray))
    }, { immediate: true }
  );
</script>

<style scoped></style>
