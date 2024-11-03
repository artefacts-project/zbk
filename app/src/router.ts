import { createRouter, createWebHistory } from "vue-router";
import { Overworld } from "@artefacts/overworld";

const routes = [
  { path: "/", name: "Start", component: Overworld },
  { path: "/overworld", name: "Overworld", component: Overworld }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
