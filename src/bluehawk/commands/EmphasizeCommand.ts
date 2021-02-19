import {
  makeBlockOrLineCommand,
  NoAttributes,
  NoAttributesSchema,
} from "./Command";

import { removeMetaRange } from "./removeMetaRange";

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

export const EmphasizeCommand = makeBlockOrLineCommand<NoAttributes>({
  name: "emphasize",
  description: "highlight line(s) in formatted output",
  attributesSchema: NoAttributesSchema,

  async process({ commandNode, parseResult }) {
    const { source } = parseResult;
    const { text } = source;

    // Strip tags
    removeMetaRange(text, commandNode);

    if (source.attributes["emphasize"] === undefined) {
      const ranges: EmphasizeRange[] = [];
      source.attributes["emphasize"] = { ranges: ranges };
    }

    if (commandNode.type === "line") {
      source.attributes["emphasize"]["ranges"].push({
        start: {
          line: commandNode.range.start.line,
          column: commandNode.range.start.column,
        },
        end: {
          line: commandNode.range.start.line,
          column: commandNode.range.start.column,
        },
      });
    } else {
      source.attributes["emphasize"]["ranges"].push({
        start: {
          line: commandNode.contentRange.start.line,
          column: commandNode.contentRange.start.column,
        },
        end: {
          line: commandNode.contentRange.end.line,
          column: commandNode.contentRange.end.column,
        },
      });
    }
  },
});
