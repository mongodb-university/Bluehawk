import MagicString from "magic-string";
import { Range } from "../Range";
import { AnyCommandNode } from "../parser";

// Removes all within the range except the content range.
// Ideal for stripping command tags and attribute lists.
export function removeMetaRange(
  s: MagicString,
  { lineRange, contentRange }: { lineRange: Range; contentRange?: Range }
): MagicString {
  if (contentRange === undefined) {
    s.remove(lineRange.start.offset, lineRange.end.offset);
  } else {
    s.remove(lineRange.start.offset, contentRange.start.offset);
    s.remove(contentRange.end.offset, lineRange.end.offset);
  }
  return s;
}
