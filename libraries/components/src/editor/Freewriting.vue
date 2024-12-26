<template>
  <div class="rounded-md shadow-open h-screen">
    <SimpleEditor class="p-4" />
  </div>
</template>

<script lang="ts" setup>
  import SimpleEditor from "./SimpleEditor.vue";

  const props = withDefaults(
    defineProps<{
      example?: any;
    }>(),
    {
      example: true
    }
  );

  const emit = defineEmits<{
    change: [];
  }>();
</script>

<style scoped></style>
