import Paragraph from "@editorjs/paragraph";
import "./editorjs-styles.css";
import type { FixedReferenceData } from "../../editor/editor-types";

export const keyFixedReference = "fixedReference";

export default class FixedReference extends Paragraph {
  constructor({ data, config, api }) {
    super({
      data,
      config,
      api,
      readOnly: true
    });
  }

  drawView() {
    const div = super.drawView();
    div.classList.add("zbk-fixed-reference");
    return div;
  }

  save(toolsContent: HTMLElement): FixedReferenceData {
    return {
      text: toolsContent.innerHTML,
      reference: super.data?.reference ?? null
    };
  }

  static get pasteConfig() {
    return {
      tags: ["FixedRef"]
    };
  }

  static get toolbox() {
    return {
      title: "Fixed Reference"
    };
  }
}
