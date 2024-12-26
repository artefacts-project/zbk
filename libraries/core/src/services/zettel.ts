import { Zettel, ZettelDraft } from "../..";

const convertFromZettelToStringArray = (zettel: Zettel | ZettelDraft) =>
  // @ts-ignore parts not yet resolved correctly
  zettel.parts.map((part) => part.text);

export class ZettelService {
  private zettel?: Zettel | ZettelDraft;
  private _isNew: boolean;
  private content?: string[];

  constructor(zettel?: Zettel | ZettelDraft) {
    if (zettel) {
      this._isNew = false;
      this.zettel = zettel;
      if (this.isDraft) {
        this.content = convertFromZettelToStringArray(this.zettel);
      }
    } else {
      this._isNew = true;
      this.content = [""];
    }
  }

  get isNew() {
    return this._isNew;
  }

  get canSetContent() {
    return this._isNew;
  }

  get isEmpty() {
    return this._isNew && (!this.content || this.content.length === 0 || this.content[0] === "");
  }

  get isDraft() {
    return this.isNew || !this.zettel || !("uid" in this.zettel);
  }

  asString() {
    return this.content?.join("\n") ?? "Nothing to display"
  }

  setContent(content: string[] | string) {
    if (this._isNew) {
      this.content = Array.isArray(content) ? content : content.split("\n");
    }
  }

  finishDraft() {
    this._isNew = false;
  }
}
