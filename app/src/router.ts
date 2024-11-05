import { createRouter, createWebHistory } from "vue-router";
import { Overworld } from "@artefacts/overworld";
import { Shifter } from "@artefacts/shifter";
 
const routes = [
  { path: "/", name: "Start", component: Overworld },
  { path: "/overworld", name: "Overworld", component: Overworld },
  { path: "/shifter", name: "Shifter", component: Shifter }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
