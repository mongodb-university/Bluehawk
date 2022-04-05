import { strict as assert } from "assert";
import {
  makeBlockTag,
  IdsRequiredAttributes,
  IdsRequiredAttributesSchema,
} from "./Tag";
import { RemoveTag } from "./RemoveTag";

export const StateTag = makeBlockTag<IdsRequiredAttributes>({
  name: "state",
  description:
    "given a state name(s) as tag ids, identifies blocks that should only appear in the given state's version of the file",
  attributesSchema: IdsRequiredAttributesSchema,
  process(request) {
    const { tagNode, fork, document, tagNodes } = request;

    const stateAttribute = document.attributes["state"];

    if (stateAttribute === undefined) {
      // We are not processing in a state file, so start one
      tagNode.attributes.id.forEach((id: string) => {
        fork({
          document,
          tagNodes,
          newModifiers: {
            state: id,
          },
          newAttributes: {
            // Set the state attribute for next time StateTag is invoked on the
            // new file
            state: id,
          },
        });
      });
    }

    // Strip all other states
    if (!tagNode.attributes.id.includes(stateAttribute)) {
      RemoveTag.process(request);
    }
  },
});
