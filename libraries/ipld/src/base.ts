import { Artefact } from "@artefacts/core";
import * as codec from "@ipld/dag-json";
import { code as dagJsonCode } from "@ipld/dag-json";
import { BlockView, ByteView, CID, Version } from "multiformats";
import { decode, encode } from "multiformats/block";
import { sha256 as hasher } from "multiformats/hashes/sha2";

export type UnretrievableIPLDBlock = {
  cid: CID;
  message: string;
};

export type AllowedIPLDBlockTypes = Artefact;

export type IPLDBlock<T> = BlockView<T, number, number, Version>;

export const createUnretrievable = (cid: CID): UnretrievableIPLDBlock => ({
  cid,
  message: `Not able to retrieve data for CID "${cid.toString()}"`
});

export const createCIDFromEncodedBlock = async <T>(bytes: ByteView<T>) => {
  // TODO: make codec/hasher parameters
  const hash = await hasher.digest(bytes);
  return CID.createV1(dagJsonCode, hash) as CID<T>;
};

export const deriveIPLDBlock = async <T>(bytes: ByteView<T>): Promise<IPLDBlock<T>> => {
  return await decode<T, number, number>({ bytes, codec, hasher });
};

export const createIPLDBlock = async <T>(inputData: T): Promise<IPLDBlock<T>> => {
  return await encode<T, number, number>({ value: inputData, codec, hasher });
};
