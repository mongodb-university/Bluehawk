import { TagProcessors } from "./../processor/Processor";
import { AnyTagNode } from "../parser";
import { BluehawkError } from "../BluehawkError";
import { flatten } from "../parser";
import { makeAttributesConformToJsonSchemaRule } from "./makeAttributesConformToJsonSchemaRule";
import { mapShorthandArgsToAttributes } from "../tags/Tag";

export interface ValidateCstResult {
  errors: BluehawkError[];
  tagsById: Map<string, AnyTagNode>;
}

// A rule function is registered for a given tag name and checks that the
// given tag node conforms to the specification of that tag. Errors can
// be reported into the result.errors array.
export type Rule = (tagNode: AnyTagNode, result: ValidateCstResult) => void;

export function validateTags(
  tagNodes: AnyTagNode[],
  tagProcessorMap: TagProcessors
): BluehawkError[] {
  const validateResult: ValidateCstResult = {
    errors: [],
    tagsById: new Map(),
  };
  flatten({
    children: tagNodes,
  } as AnyTagNode).forEach((tagNode) => {
    const tag = tagProcessorMap[tagNode.tagName];
    if (tag === undefined) {
      // TODO: warn unknown tag
      return;
    }

    const { shorthandArgsAttributeName } = tag;
    if (shorthandArgsAttributeName !== undefined) {
      // Apply the tag's shorthand rename rule to the tag node's attribute list
      mapShorthandArgsToAttributes({
        tagNode,
        shorthandArgsAttributeName,
      });
    } else if (tagNode.shorthandArgs !== undefined) {
      validateResult.errors.push({
        component: "validator",
        location: tagNode.range.start,
        message: `'${
          tagNode.tagName
        }' does not accept shorthand args ('${tagNode.shorthandArgs.join(
          " "
        )}') because the tag definition does not have shorthandArgsAttributeName set.`,
      });
      return;
    }

    if (tagNode.type === "block" && !tag.supportsBlockMode) {
      validateResult.errors.push({
        component: "validator",
        location: tagNode.range.start,
        message: `'${tagNode.tagName}' cannot be used in block mode (i.e. with -start and -end)`,
      });
      return;
    }

    if (tagNode.type === "line" && !tag.supportsLineMode) {
      validateResult.errors.push({
        component: "validator",
        location: tagNode.range.start,
        message: `'${tagNode.tagName}' cannot be used in single line mode (i.e. without -start and -end around a block)`,
      });
      return;
    }

    if (tag.attributesSchema !== undefined) {
      const attributeSchemaValidator = makeAttributesConformToJsonSchemaRule(
        tag.attributesSchema
      );
      attributeSchemaValidator(tagNode, validateResult);
    }

    tag.rules?.forEach((rule) => {
      rule(tagNode, validateResult);
    });
  });
  return validateResult.errors;
}

// standard rule implementations

export const idIsUnique: Rule = (
  tagNode: AnyTagNode,
  result: ValidateCstResult
) => {
  if (tagNode.attributes?.id !== undefined) {
    // if the tag id already exists in the set of tag ids, create a duplicate error
    const union = [
      ...new Set([
        ...Array.from(result.tagsById.keys()),
        ...tagNode.attributes.id,
      ]),
    ];
    // if the union of the seen ids and the current node's ids has fewer elements than the length of those in total... duplicate
    if (union.length != result.tagsById.size + tagNode.attributes.id.length) {
      // (result.tagsById.has(tagNode.attributes.id)) {
      result.errors.push({
        component: "validator",
        location: tagNode.range.start,
        message: `duplicate ID '${tagNode.attributes.id}' found`,
      });
    } else {
      // otherwise, add the tag id to the set
      tagNode.attributes.id.forEach((id: string) => {
        result.tagsById.set(id, tagNode);
      });
    }
  }
};
