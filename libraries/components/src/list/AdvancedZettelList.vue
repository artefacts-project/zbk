<template></template>

<script lang="ts" setup>
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
