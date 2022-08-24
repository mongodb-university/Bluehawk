import { makeBlockTag, NoAttributes, IdsRequiredAttributesSchema, IdsRequiredAttributes } from "./Tag";
import { RemoveTag } from "./RemoveTag";
import { conditionalForkWithState } from "./StateTag";

export const RemoveStateTag = makeBlockTag<IdsRequiredAttributes>({
  name: "remove-state",
  description: "given a state name(s) as tag ids, identifies blocks that should not appear in the given state's version of the file",
  attributesSchema: IdsRequiredAttributesSchema,
  shorthandArgsAttributeName: "id",
  process(request) {
    conditionalForkWithState(request)
    const {tagNode, document} = request;
    const stateAttribute = document.attributes["state"];
    // Strip all other states
    if (tagNode.attributes.id.includes(stateAttribute)) {
      RemoveTag.process(request);
    }
  },
});