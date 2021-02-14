import { strict as assert } from "assert";
import { IToken } from "chevrotain";
import { AnyCommandNode, flatten } from "../parser";
import { makeBlockCommand, NoAttributes, NoAttributesSchema } from "./Command";
import { removeMetaRange } from "./removeMetaRange";

export const UncommentCommand = makeBlockCommand<NoAttributes>({
  name: "uncomment",
  attributesSchema: NoAttributesSchema,
  process(request) {
    const { commandNode, parseResult } = request;
    const { source } = parseResult;

    // Strip tags
    removeMetaRange(source.text, commandNode);

    const { contentRange } = commandNode;
    if (contentRange == undefined) {
      return;
    }

    // Get all line comments in the hierarchy
    const lineComments = flatten(commandNode as AnyCommandNode)
      .reduce((acc, cur) => [...acc, ...cur.lineComments], [] as IToken[])
      .sort((a, b) => a.startOffset - b.startOffset);

    // TODO: it would be possible to warn here of uncommented lines
    lineComments
      .filter(
        // Remove all but the first LineComment on each line
        (lineComment, i) =>
          i === 0 || lineComments[i - 1].startLine !== lineComment.startLine
      )
      .forEach((lineComment) => {
        assert(lineComment.endOffset !== undefined);
        // Delete the line comment
        source.text.remove(lineComment.startOffset, lineComment.endOffset + 1);
      });
  },
});
