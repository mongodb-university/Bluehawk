import {
  makeBlockOrLineCommand,
  NoAttributes,
  NoAttributesSchema,
} from "./Command";

import { removeMetaRange } from "./removeMetaRange";

export interface EmphasizeRange {
  start: number;
  end: number;
}

export const EmphasizeCommand = makeBlockOrLineCommand<NoAttributes>({
  name: "emphasize",
  description: "highlight line(s) in formatted output",
  attributesSchema: NoAttributesSchema,

  process({ commandNode, parseResult }) {
    const { source } = parseResult;
    const { text } = source;

    // Strip tags
    removeMetaRange(text, commandNode);
    if (source.attributes["emphasize"] === undefined) {
      const ranges: EmphasizeRange[] = [];
      source.attributes["emphasize"] = { ranges: ranges };
    }

    const start = commandNode.lineRange.start.line;
    if (commandNode.type === "line") {
      source.attributes["emphasize"]["ranges"].push({
        start: start,
        end: start,
      });
    } else {
      source.attributes["emphasize"]["ranges"].push({
        start: start,
        end:
          start + (commandNode.range.end.line - commandNode.range.start.line),
      });
    }
  },
});
