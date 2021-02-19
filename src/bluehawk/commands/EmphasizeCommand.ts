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

  async process({ commandNode, parseResult }) {
    const { source } = parseResult;
    const { text } = source;

    // Strip tags
    removeMetaRange(text, commandNode);

    if (source.attributes["emphasize"] === undefined) {
      const ranges: EmphasizeRange[] = [];
      source.attributes["emphasize"] = { ranges: ranges };
    }

    const start = await source.getNewLocationFor({
      line: commandNode.range.start.line,
      column: commandNode.range.start.column,
    });
    if (start === undefined) {
      return undefined; // TODO: handle this error?
    }
    if (commandNode.type === "line") {
      source.attributes["emphasize"]["ranges"].push({
        start: start.line,
        end: start.line,
      });
    } else {
      const end = await source.getNewLocationFor({
        line: commandNode.contentRange.end.line - 1,
        column: commandNode.contentRange.end.column,
      });
      if (end === undefined) {
        return undefined; // TODO: handle this error?
      }
      source.attributes["emphasize"]["ranges"].push({
        start: start.line,
        end: end.line,
      });
    }
  },
});
