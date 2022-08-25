import {
  makeBlockTag,
  IdsRequiredAttributes,
  IdsRequiredAttributesSchema,
} from "./Tag";
import { RemoveTag } from "./RemoveTag";
import { BlockTagNode } from "../parser";
import { ProcessRequest } from "../processor/Processor";

export const StateTag = makeBlockTag<IdsRequiredAttributes>({
  name: "state",
  description:
    "given a state name(s) as tag ids, identifies blocks that should only appear in the given state's version of the file",
  attributesSchema: IdsRequiredAttributesSchema,
  shorthandArgsAttributeName: "id",
  process(request) {
    conditionalForkWithState(request);
    const { tagNode, document } = request;
    const stateAttribute = document.attributes["state"];
    // Strip all other states
    if (!tagNode.attributes.id.includes(stateAttribute)) {
      RemoveTag.process(request);
    }
  },
});

/**
  If we are not processing in a state file, fork a file for each
  state listed in our tag node.
*/
export const conditionalForkWithState = (
  request: ProcessRequest<BlockTagNode>
) => {
  const { tagNode, fork, document, tagNodes } = request;
  const stateAttribute = document.attributes["state"];
  if (stateAttribute === undefined) {
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
};
