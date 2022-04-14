import { makeBlockOrLineTag, NoAttributes, NoAttributesSchema } from "./Tag";

export const RemoveTag = makeBlockOrLineTag<NoAttributes>({
  name: "remove",
  description: "deletes line(s) from the result",
  attributesSchema: NoAttributesSchema,
  process({ tagNode, document, stopPropagation }) {
    const { lineRange } = tagNode;
    document.text.remove(lineRange.start.offset, lineRange.end.offset);
    stopPropagation();
  },
});
