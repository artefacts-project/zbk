import { ZettelParts, type Zettel as ZettelDraft } from "./src/model/data-model";

type UID = { uid: string };

export type Zettel<T extends ZettelParts[] | undefined = undefined> = ZettelDraft<T> & UID;

export type { ZettelDraft };

export * from "./src/services/zettel";


