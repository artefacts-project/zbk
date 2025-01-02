// https://ipfs.github.io/js-stores/modules/blockstore_idb.html

import { IDBBlockstore } from "blockstore-idb"; //TODO: use blockstore interface?
import { IPLDBlock } from "./base";
import { asyncMap } from "./utils";

const store = new IDBBlockstore("artefacts/ipld"); // TODO: wrap into function

export const storeIPLDData = async <T>(data: IPLDBlock<T> | IPLDBlock<T>[]) => {
  await store.open();
  const storedData = await asyncMap(data, async (d) => {
    await store.put(d.cid, d.bytes);
    return d;
  });
  await store.close(); //TODO: leave open?
  return storedData;
};
