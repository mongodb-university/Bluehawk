import {
  makeBlockCommand,
  IdRequiredAttributes,
  IdRequiredAttributesSchema,
} from "./Command";
import { removeMetaRange } from "./removeMetaRange";

export const StateCommand = makeBlockCommand<IdRequiredAttributes>({
  name: "state",
  attributesSchema: IdRequiredAttributesSchema,
  process(request) {
    const { commandNode, fork, parseResult } = request;
    const { source } = parseResult;

    // Strip tags
    removeMetaRange(source.text, commandNode);

    const stateAttribute = source.attributes["state"];

    if (stateAttribute === undefined) {
      // We are not processing in a state file, so start one
      fork({
        parseResult,
        newModifier: `state.${commandNode.id}`,
        newAttributes: {
          // Set the state attribute for next time StateCommand is invoked on the
          // new file
          state: commandNode.id,
        },
      });
    }

    // Strip all other states
    if (stateAttribute !== commandNode.id) {
      const { contentRange } = commandNode;
      if (contentRange === undefined) {
        // TODO: diagnostics
        return;
      }
      source.text.remove(contentRange.start.offset, contentRange.end.offset);
    }
  },
});
