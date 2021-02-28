import {
  makeBlockCommand,
  IdRequiredAttributes,
  IdRequiredAttributesSchema,
} from "./Command";

export const StateCommand = makeBlockCommand<IdRequiredAttributes>({
  name: "state",
  description:
    "given a state name as command id, identifies blocks that should only appear in the given state's version of the file",
  attributesSchema: IdRequiredAttributesSchema,
  process(request) {
    const { commandNode, fork, parseResult } = request;
    const { source } = parseResult;

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
