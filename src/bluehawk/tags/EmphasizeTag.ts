import { locationFromToken } from "../parser/locationFromToken";
import { makeBlockOrLineTag, NoAttributes, NoAttributesSchema } from "./Tag";

export interface EmphasizeRange {
  start: {
    line: number;
    column: number;
  };
  end: {
    line: number;
    column: number;
  };
}

export interface EmphasizeInputAttributes {
  ranges: EmphasizeRange[];
}

export const EmphasizeTag = makeBlockOrLineTag<NoAttributes>({
  name: "emphasize",
  description:
    "identify line(s) to highlight (see `bluehawk snip --format` tag)",
  attributesSchema: NoAttributesSchema,

  process({ tagNode, document }) {
    if (document.attributes["emphasize"] === undefined) {
      document.attributes["emphasize"] = { ranges: [] };
    }

    let range: EmphasizeRange;

    switch (tagNode.type) {
      case "block": {
        const lastNewline = tagNode.newlines[tagNode.newlines.length - 1];
        if (lastNewline === undefined) {
          throw new Error(`lastNewline unexpectedly undefined!`);
        }
        range = {
          start: tagNode.contentRange.start,
          end: locationFromToken(lastNewline),
        };
        break;
      }
      case "line":
        range = {
          start: tagNode.lineRange.start,
          end: tagNode.range.end,
        };
        break;
    }

    document.attributes["emphasize"]["ranges"].push(range);
  },
});
