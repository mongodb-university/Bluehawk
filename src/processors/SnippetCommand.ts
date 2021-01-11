import { IToken } from "chevrotain";
import MagicString from "magic-string";
import { BluehawkSource } from "../bluehawk";
import { CommandNode } from "../parser/CommandNode";
import { flatten } from "../parser/flatten";
import { ProcessRequest } from "./Processor";
import { removeMetaRange } from "./removeMetaRange";

function dedentRange(s: MagicString, command: CommandNode): MagicString {
  const { contentRange } = command;
  if (contentRange == null) {
    return s;
  }

  // Get inner content and split by line break
  const content = s.slice(contentRange.start.offset, contentRange.end.offset);
  const lines = content.split(/\r\n|\r|\n/);
  // Remove trailing newline
  lines.pop();

  // Find minimum indentation in the content block
  const minimumIndentation = lines.reduce((min, line) => {
    const match = line.match(/^\s+/);
    if (!match) {
      // No indentation
      return 0;
    }
    const indentLength = match[0].length;
    if (min == null) {
      return indentLength;
    }
    return indentLength < min ? indentLength : min;
  }, null as number | null);

  // In this case ambiguity between 0 and null is ok
  if (!minimumIndentation) {
    return s;
  }

  // Get all newlines in the hierarchy in order to work with original string
  // offsets
  const newlines = flatten(command).reduce(
    (acc, cur) => [...acc, ...cur.newlines],
    [] as IToken[]
  );

  // Dedent lines
  newlines.forEach((newline) =>
    s.remove(newline.endOffset + 1, newline.endOffset + 1 + minimumIndentation)
  );
}

export const SnippetCommand = (request: ProcessRequest): void => {
  const { command, processor, bluehawkResult } = request;
  const { source } = bluehawkResult;
  const { contentRange } = command;

  // Strip tags
  removeMetaRange(source.text, command);

  // Copy text to new working copy
  const textClone = source.text.clone();

  // Dedent
  dedentRange(textClone, command);

  // Fork subset code block to another file
  processor.fork(`${source.filePath}.codeblock.${command.id}`, {
    commands: command.children ?? [],
    errors: [],
    source: new BluehawkSource({
      filePath: source.filePath,
      language: source.language,
      text: textClone.slice(contentRange.start.offset, contentRange.end.offset),
    }),
  });
};
