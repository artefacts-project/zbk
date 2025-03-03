import { Zettel } from "../..";
import { zettelPartsSeparator } from "../utils/constants";
import { v4 } from "uuid";

const ensureStringArray = (zettel: Zettel) =>
  // @ts-ignore parts not yet resolved correctly
  Array.isArray(zettel.parts)
    ? // @ts-ignore parts not yet resolved correctly
      zettel.parts.map((part) => part.text)
    : // @ts-ignore parts not yet resolved correctly
      zettel.parts.split(zettelPartsSeparator);

export class ZettelService {
  private zettel?: Zettel;
  private readonly uid: string;
  private draft: boolean;
  private content: string[];
  private persistedState: any;

  constructor(zettel?: Zettel | ZettelService) {
    if (zettel instanceof ZettelService) {
      this.draft = zettel.isDraft;
      this.zettel = zettel.asZettel;
      this.content = zettel.asArray;
      this.persistedState = zettel.asPersistedZettel;
      this.uid = zettel.uid;
    } else if (zettel) {
      this.draft = false;
      this.zettel = zettel;
      this.content = ensureStringArray(this.zettel);
      this.uid = v4();
    } else {
      this.draft = true;
      this.content = [""];
      this.uid = v4();
    }
  }

  get id() {
    return this.uid;
  }

  get isDraft() {
    return this.draft;
  }

  get canSetContent() {
    return this.draft;
  }

  get isEmpty() {
    return this.draft && (!this.content || this.content.length === 0 || this.content[0] === "");
  }

  get asZettel() {
    return this.draft ? undefined : this.zettel;
  }

  get asString() {
    return this.content?.join(zettelPartsSeparator) ?? "";
  }

  get asArray() {
    return this.content;
  }

  get asPersistedZettel() {
    return this.persistedState;
  }

  setContent(content: string[] | string) {
    if (this.isDraft) {
      this.content = Array.isArray(content) ? content : content.split(zettelPartsSeparator);
    }
  }

  finishDraft(uid: string, persisted: any, persistenceType: string) {
    this.draft = false;
    this.zettel = {
      parts: this.asArray.map((text) => ({ text })),
      timestamp: Date.now()
    };
    this.persistedState = persisted;
  }
}
