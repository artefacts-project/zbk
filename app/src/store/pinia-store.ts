import { defineStore } from "pinia";
import { dispatch } from "@artefacts/core";
import { manageStreams } from "./manage-streams";

export const useStore = defineStore("app", () => {
  const { state, events } = manageStreams();

  return {
    ...state,
    ...events,
    dispatch
  };
});
