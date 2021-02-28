import { strict as assert } from "assert";
import { IToken } from "chevrotain";
import { AnyCommandNode, flatten } from "../parser";
import { makeBlockCommand, NoAttributes, NoAttributesSchema } from "./Command";

export const UncommentCommand = makeBlockCommand<NoAttributes>({
  name: "uncomment",
  description:
    "removes up to one line comment token from every line in its range",
  attributesSchema: NoAttributesSchema,
  process(request) {
    const { commandNode, document } = request;
    const { text } = document;

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
      .filter(({ startColumn, startOffset }) => {
        // Do not delete line comments if they are not the first thing in the
        // line (after whitespace)
        assert(startColumn);
        return (
          startColumn === 1 ||
          text.snip(startOffset - (startColumn - 1), startOffset).isEmpty()
        );
      })
      .forEach((lineComment) => {
        assert(lineComment.endOffset !== undefined);
        // Delete the line comment
        text.remove(lineComment.startOffset, lineComment.endOffset + 1);
      });
  },
});
