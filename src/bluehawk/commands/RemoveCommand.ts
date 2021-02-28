import {
  makeBlockOrLineCommand,
  NoAttributes,
  NoAttributesSchema,
} from "./Command";

export const RemoveCommand = makeBlockOrLineCommand<NoAttributes>({
  name: "remove",
  description: "deletes line(s) from the result",
  attributesSchema: NoAttributesSchema,
  process({ commandNode, document, stopPropagation, fork }) {
    const { lineRange } = commandNode;
    if (commandNode.children !== undefined) {
      // Allow inner nodes to operate on removed content. For example, an inner
      // snippet may be hidden from the parent view.
      fork({
        document,
        commandNodes: commandNode.children,
        newText: document.text.snip(
          lineRange.start.offset,
          lineRange.end.offset
        ),
        newModifiers: {
          remove: `${lineRange.start.offset}-${lineRange.end.offset}`,
        },
      });
    }
    document.text.remove(lineRange.start.offset, lineRange.end.offset);
    stopPropagation();
  },
});
