import { ProcessRequest } from "./Processor";
import { removeMetaRange } from "./removeMetaRange";

export const StateCommand = (request: ProcessRequest): void => {
  const { command, processor, bluehawkResult } = request;
  const { source } = bluehawkResult;

  const stateAttribute = source.attributes["state"];
  if (stateAttribute === undefined) {
    // We are not processing in a state file, so start one
    processor.fork(
      source.pathWithInfix(`state.${command.id}`),
      bluehawkResult,
      {
        ...source.attributes,
        // Set the state attribute for next time StateCommand is invoked on the
        // new file
        state: command.id,
      }
    );
    return;
  }

  // Strip tags
  removeMetaRange(source.text, command);

  // We are processing a state. Strip all other states.
  if (stateAttribute !== command.id) {
    const { contentRange } = command;
    source.text.remove(contentRange.start.offset, contentRange.end.offset);
  }
};
