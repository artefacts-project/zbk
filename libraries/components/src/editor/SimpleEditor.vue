<template>
  <div
    class="editor"
    ref="editorElement"
  ></div>
</template>

<script setup lang="ts">
  import type { Insertion, EditorEvents, Update, FixedReferenceData } from "./editor-types";
  import { convertToEditorJSFormat, convertToStringArray } from "../utils/editorjs/editorjs-utils";
  import FixedReference, { keyFixedReference } from "../utils/editorjs/fixed-reference";
  import type { OutputData } from "@editorjs/editorjs";
  import EditorJS from "@editorjs/editorjs";
  import { onMounted, onUnmounted, ref, watch } from "vue";

  const props = withDefaults(defineProps<{ content?: string; editorEvents?: EditorEvents }>(), {
    content: ""
  });

  const emit = defineEmits<{ changed: [string[]] }>();

  const editor = ref<EditorJS | null>(null);
  const editorElement = ref<HTMLElement | undefined>();

  onMounted(() => {
    editor.value = new EditorJS({
      holder: editorElement.value,
      minHeight: 0,
      tools: {
        [keyFixedReference]: FixedReference
      },
      onChange() {
        editor.value
          ?.save?.()
          .then((data: OutputData) => {
            emit("changed", convertToStringArray(data));
          })
          .catch((error) => {
            console.error("EditorJS saving failed: ", error);
          });
      },
      onReady() {
        if (props.content) {
          editor.value.render(convertToEditorJSFormat(props.content));
        }
      }
    });
  });

  watch(editor, (newValue) => console.log("editor", newValue));

  const insert = (inserts: Insertion[]) => {
    for (const [index, insert] of inserts.entries()) {
      editor.value?.blocks?.insert(
        insert.type,
        insert.type === keyFixedReference
          ? {
              reference: insert.data.reference,
              text: insert.data.reference.text
            }
          : {
              text: insert.data.text
            },
        null,
        0 + index,
        true,
        false,
        insert.id
      );
    }
  };

  const update = (param: Update) => {
    editor.value?.blocks?.update(param.id, param.data);
  };

  const clearAndReset = (content: Insertion[] | void | null = null) => {
    editor.value?.blocks?.clear();
    if (content) {
      insert(content);
    }
  };

  if (props.editorEvents) {
    props.editorEvents.onInsert(insert);
    props.editorEvents.onUpdate(update);
    props.editorEvents.onClearAndReset(clearAndReset);
  }

  watch(
    () => props.content,
    (newValue) => editor?.value?.render(convertToEditorJSFormat(newValue))
  );

  onUnmounted(() => {
    editor.value?.destroy();
  });
</script>

<style scoped>
  .codex-editor__loader {
    height: 2rem !important;
  }

  .editor :deep(.codex-editor) {
    margin: 0.5rem;
  }
</style>
