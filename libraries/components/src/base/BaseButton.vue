<template>
  <button
    class="btn btn-outline border-base-300 hover:bg-inherit hover:text-inherit hover:border-inherit"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup></script>

<style scoped>
  button:hover {
    animation: glow-once 0.25s ease-in-out forwards;
  }

  @keyframes glow-once {
    from {
      box-shadow: 0 0 0.25rem oklch(var(--b3));
    }
    to {
      box-shadow: 0 0 1rem oklch(var(--b3));
    }
  }
</style>
