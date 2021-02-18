import {
  makeBlockOrLineCommand,
  NoAttributes,
  NoAttributesSchema,
} from "./Command";

import { removeMetaRange } from "./removeMetaRange";

export const EmphasizeCommand = makeBlockOrLineCommand<NoAttributes>({
  attributesSchema: NoAttributesSchema,

  process({ commandNode, parseResult }) {
    const { source } = parseResult;
    const { text } = source;

    // Strip tags
    removeMetaRange(text, commandNode);
    commandNode.attributes = {};
    commandNode.attributes["emphasize"] = commandNode.lineRange;
  },
});
