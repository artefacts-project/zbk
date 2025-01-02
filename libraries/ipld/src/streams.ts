import { Artefact, events, ZettelService } from "@artefacts/core";
import { concatMap, merge, Observable, shareReplay, zip } from "rxjs";
import { createZettel } from "./create-ipld";
import { storeIPLDData } from "./idb-adapter";
import { IPLDBlock } from "./base";

export const streamNewZettel = () => {
  const newZettel$ = merge(events.createNewZettel);
  const newIPLDZettel$ = newZettel$.pipe(concatMap(createZettel), shareReplay(1));
  return {
    newZettel$,
    newIPLDZettel$
  };
};

export const storeIdb = (artefact$: Observable<IPLDBlock<Artefact>>) => {
  return artefact$.pipe(concatMap(storeIPLDData));
};

export const confirmCreationZettel = (
  zettel$: Observable<ZettelService>,
  storedArtefact$: Observable<IPLDBlock<Artefact>>
) => {
  zip(zettel$, storedArtefact$).subscribe(([zettel, stored]) => {
    zettel.finishDraft(stored.cid.toString());
  });

  return zettel$;
};
