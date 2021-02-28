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

function dedentRange(
  s: MagicString,
  { contentRange }: BlockCommandNode
): MagicString {
  if (contentRange === undefined) {
    return s;
  }

  // Find minimum indentation in the content block
  const re = /(.*)(?:\r|\n|\r\n)/y;
  let minimumIndentation: number | undefined = undefined;
  re.lastIndex = contentRange.start.offset;
  for (
    let match = re.exec(s.original);
    match && re.lastIndex <= contentRange.end.offset;
    match = re.exec(s.original)
  ) {
    const line = match[1];
    if (line.length === 0) {
      continue;
    }
    const indentMatch = line.match(/^\s+/);
    if (!indentMatch) {
      // No indentation
      minimumIndentation = 0;
      break;
    }
    const indentLength = indentMatch[0].length;
    if (minimumIndentation === undefined || indentLength < minimumIndentation) {
      minimumIndentation = indentLength;
    }
  }

  // In this case ambiguity between 0 and null is ok
  if (!minimumIndentation) {
    return s;
  }

  // Dedent lines
  re.lastIndex = contentRange.start.offset;
  for (
    let match = re.exec(s.original), offset = contentRange.start.offset;
    match && re.lastIndex <= contentRange.end.offset;
    match = re.exec(s.original), offset
  ) {
    const line = match[1];
    s.remove(offset, offset + Math.min(line.length, minimumIndentation));
    offset = re.lastIndex;
  }

  return s;
}

export const SnippetCommand = makeBlockCommand<IdRequiredAttributes>({
  name: "snippet",
  description: "identifies snippets for extraction into standalone files",
  attributesSchema: IdRequiredAttributesSchema,
  rules: [idIsUnique],
  process: (request: ProcessRequest<BlockCommandNode>): void => {
    const { commandNode, parseResult, fork } = request;
    const { source } = parseResult;
    const { contentRange } = commandNode;

    if (source.attributes["snippet"] !== undefined) {
      // Nested snippet. Its output will be the same as unnested.
      return;
    }

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
