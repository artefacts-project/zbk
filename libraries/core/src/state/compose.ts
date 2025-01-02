export interface PersistenceLayer {
  create: () => void;
}

export interface StorageLayer {
  store: () => void;
}

const create = (persistenceLayer: PersistenceLayer, storageLayer: StorageLayer) => {};

export class Compose {
  persistenceLayer?: PersistenceLayer;
  storageLayer?: StorageLayer;

  constructor() {}

  addPersistenceLayer(layer: PersistenceLayer) {
    this.persistenceLayer = layer;
    return this;
  }

  addStorageLayer(layer: StorageLayer) {
    this.storageLayer = layer;
    return this;
  }
  provide() {
    const state = {};
    const events = {};

    return {
      state,
      events
    };
  }
}
