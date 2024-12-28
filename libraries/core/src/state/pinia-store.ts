import { defineStore } from "pinia";
import { dispatch } from "./rx-store";

export const useStore = defineStore("app", () => {
  return {
    dispatch
  };
});
