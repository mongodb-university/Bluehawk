import {
  makeBlockOrLineCommand,
  NoAttributes,
  NoAttributesSchema,
} from "./Command";

export const RemoveCommand = makeBlockOrLineCommand<NoAttributes>({
  name: "remove",
  description: "deletes line(s) from the result",
  attributesSchema: NoAttributesSchema,
  process({ commandNode, document, stopPropagation }) {
    const { lineRange } = commandNode;
    document.text.remove(lineRange.start.offset, lineRange.end.offset);
    stopPropagation();
  },
});
