import { Compose } from "@artefacts/core";

export const manageStreams = () => {
  const { state, events } = new Compose().provide();

  return {
    state,
    events
  };
};
