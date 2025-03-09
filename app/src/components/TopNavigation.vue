<template>
  <div class="navbar min-h-2 bg-base-300 px-2 py-0 border-b border-secondary-content">
    <div class="navbar-start">
      <RouterLink
        to="/"
        class="btn h-10 min-h-10 ml-10 btn-ghost text-xl gap-0"
      >
          <span class="font-bold">arte</span>
          <span class="italic font-medium mt-[8px] mr-[2px] ml-[-2px]">f</span>
          <span class="italic font-medium">acts</span>
      </RouterLink>
    </div>
    <div class="navbar-center flex gap-2">
      <ul class="menu menu-horizontal px-1">
        <li>
          <RouterLink
            to="/organizing-tabs"
            class="py-1"
            >Organizing Tabs</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/shifting-canvas"
            class="py-1"
            >Shifting Canvas</RouterLink
          >
        </li>
      </ul>
    </div>
    <div class="navbar-end">
      <div class="dropdown">
        <div
          tabindex="0"
          role="button"
          class="btn h-6 min-h-6 w-36 m-1"
        >
          {{ currentTheme }}
          <ChevronDownIcon class="h-3 w-3 opacity-60" />
        </div>
        <ul
          tabindex="0"
          class="dropdown-content p-2 shadow-2xl bg-base-300 rounded-box z-50"
        >
          <li
            v-for="theme in themes"
            :key="theme"
          >
            <input
              type="radio"
              name="theme-dropdown"
              class="theme-controller btn btn-xs btn-block btn-ghost justify-start"
              :aria-label="theme"
              :value="theme"
              @change="setTheme(($event.target as HTMLInputElement).value)"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ChevronDownIcon } from "@heroicons/vue/24/outline";
  import { ref } from "vue";
  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "halloween",
    "garden",
    "forest",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "night",
    "winter",
    "dim",
    "nord",
    "sunset"
  ];

  const currentTheme = ref("light");

  const setTheme = (newTheme: string) => {
    document.documentElement.setAttribute("data-theme", newTheme);
    currentTheme.value = newTheme;
  };

  (window as any).runTheme = async () => {
    for (const theme of themes) {
      // to decide on basis for theme
      setTheme(theme);
      await new Promise((resolve) => setTimeout(resolve, 4000));
    }
  };

  setTheme(currentTheme.value);
</script>

<style scoped></style>
