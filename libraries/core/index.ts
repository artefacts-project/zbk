import { ZettelParts, type Zettel as ZettelBase } from "./src/model/data-model";

type UID = { uid: string };
type DraftID = { draftId: string };

export type Zettel<T extends ZettelParts[] | undefined = undefined> = ZettelBase<T> & UID;
export type ZettelDraft<T extends ZettelParts[] | undefined = undefined> = ZettelBase<T> & DraftID;

export * from "./src/services/zettel";
export * from "./src/state/state";
