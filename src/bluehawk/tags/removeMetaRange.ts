import MagicString from "magic-string";

import { AnyTagNode, BlockTagNode, LineTagNode } from "../parser";

function removeMetaRangeForLineTagNode(
  s: MagicString,
  tagNode: LineTagNode
): MagicString {
  s.remove(tagNode.range.start.offset, tagNode.range.end.offset + 1);
  return s;
}

function removeMetaRangeForBlockTagNode(
  s: MagicString,
  tagNode: BlockTagNode
): MagicString {
  const { lineRange, contentRange } = tagNode;
  s.remove(lineRange.start.offset, contentRange.start.offset);
  s.remove(contentRange.end.offset, lineRange.end.offset);
  return s;
}

// Removes all within the range except the content range.
// Ideal for stripping tag tags and attribute lists.
export function removeMetaRange(
  s: MagicString,
  tagNode: AnyTagNode
): MagicString {
  tagNode.associatedTokens.forEach((token) =>
    s.remove(token.startOffset, (token.endOffset ?? token.startOffset) + 1)
  );

  switch (tagNode.type) {
    case "line":
      return removeMetaRangeForLineTagNode(s, tagNode as LineTagNode);
    case "block":
      return removeMetaRangeForBlockTagNode(s, tagNode as BlockTagNode);
  }
}
