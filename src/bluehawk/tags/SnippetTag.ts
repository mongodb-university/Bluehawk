import MagicString from "magic-string";
import { BlockTagNode } from "../parser/TagNode";
import { ProcessRequest } from "../processor/Processor";
import { idIsUnique } from "../parser/validator";
import { strict as assert } from "assert";
import {
  makeBlockTag,
  IdRequiredAttributes,
  IdRequiredAttributesSchema,
} from "./Tag";

function dedentRange(
  s: MagicString,
  { contentRange }: BlockTagNode
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

export const SnippetTag = makeBlockTag<IdRequiredAttributes>({
  name: "snippet",
  description: "identifies snippets for extraction into standalone files",
  attributesSchema: IdRequiredAttributesSchema,
  shorthandArgsAttributeName: "id",
  rules: [idIsUnique],
  process: (request: ProcessRequest<BlockTagNode>): void => {
    const { tagNode, document, fork } = request;
    const { contentRange } = tagNode;

    if (document.attributes["snippet"] !== undefined) {
      // Nested snippet. Its output will be the same as unnested.
      return;
    }

    // Copy text to new working copy
    const clonedSnippet = document.text.snip(
      contentRange.start.offset,
      contentRange.end.offset
    );

    // Dedent
    dedentRange(clonedSnippet, tagNode);

    // ID is required and enforced by the validator, so it should exist
    assert(
      tagNode.attributes.id !== undefined && tagNode.attributes.id.length > 0
    );

    // Fork subset code block to another file
    fork({
      document,
      tagNodes: tagNode.children ?? [],
      newPath: document.pathWithInfix(`codeblock.${tagNode.attributes.id[0]}`),
      newText: clonedSnippet,
      newAttributes: {
        snippet: tagNode.attributes.id[0],
      },
    });
  },
});
