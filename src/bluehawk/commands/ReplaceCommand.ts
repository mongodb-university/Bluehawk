import { makeBlockCommand } from "./Command";
import { removeMetaRange } from "./removeMetaRange";

type ReplaceCommandAttributes = {
  terms: {
    // Replace '<key>' with '<value>'
    [searchTerm: string]: /* replaceTerm */ string;
  };
};

export const ReplaceCommand = makeBlockCommand<ReplaceCommandAttributes>({
  attributesSchema: {
    type: "object",
    required: ["terms"],
    properties: {
      terms: {
        type: "object",
        minProperties: 1,
        additionalProperties: { type: "string" },
        required: [],
      },
    },
  },

  process({ commandNode, parseResult }) {
    const attributes = commandNode.attributes as ReplaceCommandAttributes;
    const { source } = parseResult;
    const { text } = source;

    // Strip tags
    removeMetaRange(text, commandNode);

    const { contentRange } = commandNode;
    if (contentRange == undefined) {
      // TODO: error
      return;
    }
    const contentLength = contentRange.end.offset - contentRange.start.offset;
    const { terms } = attributes;
    Object.entries(terms).forEach(([searchTerm, replaceTerm]) => {
      if (contentLength < searchTerm.length) {
        // It will be impossible to find the search term within this block
        return;
      }
      const indexOf = (s: string, term: string, index: number): number => {
        return s.indexOf(term, index);
      };
      const { original } = text;
      for (
        let position = indexOf(original, searchTerm, contentRange.start.offset);
        position !== -1 &&
        position < contentRange.end.offset - searchTerm.length;
        position = indexOf(original, searchTerm, position + 1)
      ) {
        text.overwrite(position, position + searchTerm.length, replaceTerm);
      }
    });
  },
});
