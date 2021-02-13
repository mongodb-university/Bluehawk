import MagicString from "magic-string";
import { Document } from "../Document";
import { BlockCommandNode } from "../parser/CommandNode";
import { ProcessRequest } from "../processor/Processor";
import { idIsUnique } from "../processor/validator";
import {
  makeBlockCommand,
  IdRequiredAttributes,
  IdRequiredAttributesSchema,
} from "./Command";
import { removeMetaRange } from "./removeMetaRange";

function dedentRange(
  s: MagicString,
  { contentRange }: BlockCommandNode
): MagicString {
  if (contentRange === undefined) {
    return s;
  }

  // Get inner content and split by line break
  const content = s.original.substring(
    contentRange.start.offset,
    contentRange.end.offset
  );
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
    if (min === undefined) {
      return indentLength;
    }
    return indentLength < min ? indentLength : min;
  }, undefined as number | undefined);

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

  return s;
}

export const SnippetCommand = makeBlockCommand<IdRequiredAttributes>({
  attributesSchema: IdRequiredAttributesSchema,
  rules: [idIsUnique],
  process: (request: ProcessRequest<BlockCommandNode>): void => {
    const { commandNode, parseResult, fork } = request;
    const { source } = parseResult;
    const { contentRange } = commandNode;

    if (contentRange === undefined) {
      // TODO: diagnostics
      return;
    }

    // Strip tags
    removeMetaRange(source.text, commandNode);

    // Copy text to new working copy
    const clonedSnippet = source.text.snip(
      contentRange.start.offset,
      contentRange.end.offset
    );

    // Dedent
    dedentRange(clonedSnippet, commandNode);

    // Fork subset code block to another file
    fork({
      parseResult: {
        commandNodes: commandNode.children ?? [],
        errors: [],
        source: new Document({
          ...source,
          path: source.pathWithInfix(`codeblock.${commandNode.id}`),
          text: clonedSnippet,
        }),
      },
      newAttributes: {
        snippet: commandNode.id,
      },
    });
  },
});
