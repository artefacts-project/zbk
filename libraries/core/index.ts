// import { ZettelParts, type Zettel as ZettelBase, List as ListBase } from "./src/model/data-model";

// type UID = { uid: string };
// type DraftID = { draftId: string };
// type ListId = { listId: string };

// export type Zettel<T extends ZettelParts[] | undefined = undefined> = ZettelBase<T> & UID;
// export type ZettelDraft<T extends ZettelParts[] | undefined = undefined> = ZettelBase<T> & DraftID;

// export type Artefact = Zettel | ZettelDraft;

export * from "./src/services/zettel";
export * from "./src/services/list";
export * from "./src/state/state";
export * from "./src/model/data-model";

