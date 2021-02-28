import { strict as assert } from "assert";
import {
  makeBlockCommand,
  IdRequiredAttributes,
  IdRequiredAttributesSchema,
} from "./Command";
import { RemoveCommand } from "./RemoveCommand";

export const StateCommand = makeBlockCommand<IdRequiredAttributes>({
  name: "state",
  description:
    "given a state name as command id, identifies blocks that should only appear in the given state's version of the file",
  attributesSchema: IdRequiredAttributesSchema,
  process(request) {
    const { commandNode, fork, document, commandNodes } = request;

    const stateAttribute = document.attributes["state"];

    assert(commandNode.id !== undefined);

    if (stateAttribute === undefined) {
      // We are not processing in a state file, so start one
      fork({
        document,
        commandNodes,
        newModifiers: {
          state: commandNode.id,
        },
        newAttributes: {
          // Set the state attribute for next time StateCommand is invoked on the
          // new file
          state: commandNode.id,
        },
      });
    }

    // Strip all other states
    if (stateAttribute !== commandNode.id) {
      RemoveCommand.process(request);
    }
  },
});
