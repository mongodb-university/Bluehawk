import { ProcessRequest } from "../processor/Processor";
import { Command } from "./Command";
import { removeMetaRange } from "./removeMetaRange";
import { hasId } from "../processor/validator";

export const StateCommand: Command = {
  rules: [hasId],
  process: (request: ProcessRequest): void => {
    const { command, fork, parseResult } = request;
    const { source } = parseResult;

    // Strip tags
    removeMetaRange(source.text, command);

    const stateAttribute = source.attributes["state"];

    if (stateAttribute === undefined) {
      // We are not processing in a state file, so start one
      fork({
        parseResult,
        newModifier: `state.${command.id}`,
        newAttributes: {
          // Set the state attribute for next time StateCommand is invoked on the
          // new file
          state: command.id,
        },
      });
    }

    // Strip all other states
    if (stateAttribute !== command.id) {
      const { contentRange } = command;
      if (contentRange === undefined) {
        // TODO: diagnostics
        return;
      }
      source.text.remove(contentRange.start.offset, contentRange.end.offset);
    }
  },
};
