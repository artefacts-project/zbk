import { Zettel, ZettelService } from "@artefacts/core";
import { createIPLDBlock } from "./base";

export const createZettel = async (zettel: ZettelService) => {
  return await createIPLDBlock(zettel.asZettel);
};