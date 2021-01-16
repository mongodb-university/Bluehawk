import { makeAttributesConformToJsonSchemaRule } from "../processor/makeAttributesConformToJsonSchemaRule";
import { ProcessRequest } from "../processor/Processor";
import { Command } from "./Command";
import { removeMetaRange } from "./removeMetaRange";

type ReplaceCommandAttributes = {
  // Replace '<key>' with '<value>'
  [searchTerm: string]: /* replaceTerm */ string;
};

export const ReplaceCommand: Command = {
  rules: [
    makeAttributesConformToJsonSchemaRule<ReplaceCommandAttributes>({
      type: "object",
      additionalProperties: { type: "string" },
      minProperties: 1,
    }),
  ],

  process: ({ command, parseResult }: ProcessRequest): void => {
    const { attributes } = command;
    if (attributes === undefined) {
      // TODO: error (though this can't happen if the validator was used
      return;
    }

    const { source } = parseResult;
    const { text } = source;

    // Strip tags
    removeMetaRange(text, command);

    const { contentRange } = command;
    if (contentRange == undefined) {
      // TODO: error
      return;
    }
    const contentLength = contentRange.end.offset - contentRange.start.offset;
    Object.entries(attributes as ReplaceCommandAttributes).forEach(
      ([searchTerm, replaceTerm]) => {
        if (contentLength < searchTerm.length) {
          // It will be impossible to find the search term within this block
          return;
        }
        const indexOf = (s: string, term: string, index: number): number => {
          return s.indexOf(term, index);
        };
        const { original } = text;
        for (
          let position = indexOf(
            original,
            searchTerm,
            contentRange.start.offset
          );
          position !== -1 &&
          position < contentRange.end.offset - searchTerm.length;
          position = indexOf(original, searchTerm, position + 1)
        ) {
          text.overwrite(position, position + searchTerm.length, replaceTerm);
        }
      }
    );
  },
};
