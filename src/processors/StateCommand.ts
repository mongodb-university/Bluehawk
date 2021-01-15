import { ProcessRequest } from "./Processor";
import { removeMetaRange } from "./removeMetaRange";

export const StateCommand = (request: ProcessRequest): void => {
  const { command, processor, bluehawkResult } = request;
  const { source } = bluehawkResult;

  // Strip tags
  removeMetaRange(source.text, command);

  const stateAttribute = source.attributes["state"];

  if (stateAttribute === undefined) {
    // We are not processing in a state file, so start one
    processor.fork({
      bluehawkResult,
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
    source.text.remove(contentRange.start.offset, contentRange.end.offset);
  }
};
