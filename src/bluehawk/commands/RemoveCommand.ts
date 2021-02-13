import { Command, NoAttributes, NoAttributesSchema } from "./Command";

export const RemoveCommand: Command<NoAttributes> = {
  attributesSchema: NoAttributesSchema,
  process({ commandNode, parseResult }) {
    const { lineRange } = commandNode;
    parseResult.source.text.remove(
      lineRange.start.offset,
      lineRange.end.offset
    );
  },
};
