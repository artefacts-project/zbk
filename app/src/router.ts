import { createRouter, createWebHistory } from "vue-router";
import { OrganizingTabs } from "@artefacts/organizing-tabs";
import { ShiftingCanvas } from "@artefacts/shifting-canvas";
 
const routes = [
  { path: "/", name: "Start", component: OrganizingTabs },
  { path: "/organizing-tabs", name: "OrganizingTabs", component: OrganizingTabs },
  { path: "/shifting-canvas", name: "ShiftingCanvas", component: ShiftingCanvas }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
