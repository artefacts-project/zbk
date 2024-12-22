<template>
  <div>Add Notes
    {{ test }}
    <input v-model="test">
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';


const test = ref("test")
</script>

<style scoped></style>
