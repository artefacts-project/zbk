/**
 * Utility types to help abstract somewhat from specific editor implementations
 */

import { ParagraphData } from "@editorjs/paragraph";

export type EditorDataModel = { id?: string; text: string | string[] };

export type BlockContent = EditorDataModel;

export type FixedReferenceData = { reference: BlockContent; text: string };

export type Update = { id: string; data: FixedReferenceData };

export type Insertion<T extends ParagraphData | FixedReferenceData = ParagraphData> = {
  id?: string;
  type: string;
  data: T;
};

export type EditorEvents = {
  onInsert: (callback: (inserts: Insertion[]) => void) => void;
  onUpdate: (callback: (param: Update) => void) => void;
  onClearAndReset: (callback: (content?: Insertion[]) => void) => void;
};
