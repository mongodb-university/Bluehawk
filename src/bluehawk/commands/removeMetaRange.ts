import MagicString from "magic-string";
import { AnyCommandNode, BlockCommandNode, LineCommandNode } from "../parser";

function removeMetaRangeForLineCommandNode(
  s: MagicString,
  commandNode: LineCommandNode
): MagicString {
  s.remove(commandNode.range.start.offset, commandNode.range.end.offset + 1);
  return s;
}

function removeMetaRangeForBlockCommandNode(
  s: MagicString,
  commandNode: BlockCommandNode
): MagicString {
  const { lineRange, contentRange } = commandNode;
  s.remove(lineRange.start.offset, contentRange.start.offset);
  s.remove(contentRange.end.offset, lineRange.end.offset);
  return s;
}

// Removes all within the range except the content range.
// Ideal for stripping command tags and attribute lists.
export function removeMetaRange(
  s: MagicString,
  commandNode: AnyCommandNode
): MagicString {
  commandNode.associatedTokens.forEach((token) =>
    s.remove(token.startOffset, (token.endOffset ?? token.startOffset) + 1)
  );

  switch (commandNode.type) {
    case "line":
      return removeMetaRangeForLineCommandNode(
        s,
        commandNode as LineCommandNode
      );
    case "block":
      return removeMetaRangeForBlockCommandNode(
        s,
        commandNode as BlockCommandNode
      );
  }
}
