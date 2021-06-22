import { strict as assert } from "assert";
import {
  makeBlockCommand,
  IdsRequiredAttributes,
  IdsRequiredAttributesSchema,
} from "./Command";
import { RemoveCommand } from "./RemoveCommand";

export const StateCommand = makeBlockCommand<IdsRequiredAttributes>({
  name: "state",
  description:
    "given a state name(s) as command ids, identifies blocks that should only appear in the given state's version of the file",
  attributesSchema: IdsRequiredAttributesSchema,
  process(request) {
    const { commandNode, fork, document, commandNodes } = request;

    const stateAttribute = document.attributes["state"];

    if (stateAttribute === undefined) {
      // We are not processing in a state file, so start one
      commandNode.attributes.id.forEach((id: string) => {
        fork({
          document,
          commandNodes,
          newModifiers: {
            state: id,
          },
          newAttributes: {
            // Set the state attribute for next time StateCommand is invoked on the
            // new file
            state: id,
          },
        });
      });
    }

    // Strip all other states
    if (!commandNode.attributes.id.includes(stateAttribute)) {
      RemoveCommand.process(request);
    }
  },
});
