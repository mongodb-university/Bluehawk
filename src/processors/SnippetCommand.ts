import MagicString from "magic-string";
import { BluehawkSource } from "../BluehawkSource";
import { CommandNode } from "../parser/CommandNode";
import { ProcessRequest } from "./Processor";
import { removeMetaRange } from "./removeMetaRange";

function dedentRange(
  s: MagicString,
  { contentRange }: CommandNode
): MagicString {
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
    if (line.length === 0) {
      return min;
    }
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

  // Dedent lines
  let offset = contentRange.start.offset;
  lines.forEach((line) => {
    s.remove(offset, offset + Math.min(line.length, minimumIndentation));
    offset += line.length + 1;
  });
}

export const SnippetCommand = (request: ProcessRequest): void => {
  const { command, processor, bluehawkResult } = request;
  const { source } = bluehawkResult;
  const { contentRange } = command;

  // Strip tags
  removeMetaRange(source.text, command);

  // Copy text to new working copy
  const clonedSnippet = source.text.snip(
    contentRange.start.offset,
    contentRange.end.offset
  );

  // Dedent
  dedentRange(clonedSnippet, command);

  // Fork subset code block to another file
  processor.fork({
    bluehawkResult: {
      commands: command.children ?? [],
      errors: [],
      source: new BluehawkSource({
        ...source,
        path: source.pathWithInfix(`codeblock.${command.id}`),
        text: clonedSnippet,
      }),
    },
    newAttributes: {
      snippet: command.id,
    },
  });
};
