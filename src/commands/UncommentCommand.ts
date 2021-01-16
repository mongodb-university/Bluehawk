import { IToken } from "chevrotain";
import { flatten } from "../parser/flatten";
import { ProcessRequest } from "../processor/Processor";
import { Command } from "./Command";
import { removeMetaRange } from "./removeMetaRange";

export const UncommentCommand: Command = {
  rules: [],
  process: (request: ProcessRequest): void => {
    const { command, parseResult } = request;
    const { source } = parseResult;

    // Strip tags
    removeMetaRange(source.text, command);

    const { contentRange } = command;
    if (contentRange == null) {
      return;
    }

    // Get all line comments in the hierarchy
    const lineComments = flatten(command)
      .reduce((acc, cur) => [...acc, ...cur.lineComments], [] as IToken[])
      .sort((a, b) => a.startOffset - b.startOffset);

    // TODO: it would be possible to warn here of uncommented lines
    lineComments
      .filter(
        // Remove all but the first LineComment on each line
        (lineComment, i) =>
          i === 0 || lineComments[i - 1].startLine !== lineComment.startLine
      )
      .forEach((lineComment) =>
        // Delete the line comment
        source.text.remove(lineComment.startOffset, lineComment.endOffset + 1)
      );
  },
};
