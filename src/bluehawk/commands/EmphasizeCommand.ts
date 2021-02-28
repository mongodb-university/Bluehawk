import { locationFromToken } from "../parser/locationFromToken";
import {
  makeBlockOrLineCommand,
  NoAttributes,
  NoAttributesSchema,
} from "./Command";

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

export interface EmphasizeSourceAttributes {
  ranges: EmphasizeRange[];
}

export const EmphasizeCommand = makeBlockOrLineCommand<NoAttributes>({
  name: "emphasize",
  description:
    "identify line(s) to highlight (see `bluehawk snip --format` command)",
  attributesSchema: NoAttributesSchema,

  process({ commandNode, parseResult }) {
    const { source } = parseResult;

    if (source.attributes["emphasize"] === undefined) {
      source.attributes["emphasize"] = { ranges: [] };
    }

    let range: EmphasizeRange;

    switch (commandNode.type) {
      case "block": {
        const lastNewline =
          commandNode.newlines[commandNode.newlines.length - 1];
        if (lastNewline === undefined) {
          throw new Error(`lastNewline unexpectedly undefined!`);
        }
        range = {
          start: commandNode.contentRange.start,
          end: locationFromToken(lastNewline),
        };
        break;
      }
      case "line":
        range = {
          start: commandNode.lineRange.start,
          end: commandNode.range.end,
        };
        break;
    }

    source.attributes["emphasize"]["ranges"].push(range);
  },
});
