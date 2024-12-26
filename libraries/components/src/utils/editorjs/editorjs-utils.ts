import type { OutputData } from "@editorjs/editorjs";

export const convertToEditorJSFormat = (input: string | []): OutputData => {
  const data = Array.isArray(input) ? input : input.split("\n");

  const blocks = data.map((text) => ({
    type: "paragraph",
    data: { text }
  }));

  return {
    version: "",
    time: 0,
    blocks
  };
};

export const convertToStringArray = (data: OutputData): string[] => {
  return data.blocks.map(block => block.data?.text?.replaceAll("<br>", "\n") ?? "")
}
