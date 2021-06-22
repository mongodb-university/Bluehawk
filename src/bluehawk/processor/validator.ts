import { AnyCommandNode } from "../parser";
import { BluehawkError } from "../BluehawkError";
import { flatten } from "../parser";
import { CommandProcessors } from "./Processor";
import { makeAttributesConformToJsonSchemaRule } from "./makeAttributesConformToJsonSchemaRule";

export interface ValidateCstResult {
  errors: BluehawkError[];
  commandsById: Map<string, AnyCommandNode>;
}

// A rule function is registered for a given command name and checks that the
// given command node conforms to the specification of that command. Errors can
// be reported into the result.errors array.
export type Rule = (
  commandNode: AnyCommandNode,
  result: ValidateCstResult
) => void;

export function validateCommands(
  commandNodes: AnyCommandNode[],
  commandProcessorMap: CommandProcessors
): BluehawkError[] {
  const validateResult: ValidateCstResult = {
    errors: [],
    commandsById: new Map(),
  };
  flatten({
    children: commandNodes,
  } as AnyCommandNode).forEach((commandNode) => {
    const command = commandProcessorMap[commandNode.commandName];
    if (command === undefined) {
      // TODO: warn unknown command
      return;
    }

    if (commandNode.type === "block" && !command.supportsBlockMode) {
      validateResult.errors.push({
        component: "validator",
        location: commandNode.range.start,
        message: `'${commandNode.commandName}' cannot be used in block mode (i.e. with -start and -end)`,
      });
      return;
    }

    if (commandNode.type === "line" && !command.supportsLineMode) {
      validateResult.errors.push({
        component: "validator",
        location: commandNode.range.start,
        message: `'${commandNode.commandName}' cannot be used in single line mode (i.e. without -start and -end around a block)`,
      });
      return;
    }

    if (command.attributesSchema !== undefined) {
      const attributeSchemaValidator = makeAttributesConformToJsonSchemaRule(
        command.attributesSchema
      );
      attributeSchemaValidator(commandNode, validateResult);
    }

    command.rules?.forEach((rule) => {
      rule(commandNode, validateResult);
    });
  });
  return validateResult.errors;
}

// standard rule implementations

export const idIsUnique: Rule = (
  commandNode: AnyCommandNode,
  result: ValidateCstResult
) => {
  if (commandNode.id !== undefined) {
    // if the command id already exists in the set of command ids, create a duplicate error
    const union = [
      ...new Set([
        ...Array.from(result.commandsById.keys()),
        ...commandNode.id,
      ]),
    ];
    // if the union of the seen ids and the current node's ids has fewer elements than the length of those in total... duplicate
    if (union.length != result.commandsById.size + commandNode.id.length) {
      // (result.commandsById.has(commandNode.id)) {
      result.errors.push({
        component: "validator",
        location: commandNode.range.start,
        message: `duplicate ID '${commandNode.id}' found`,
      });
    } else {
      // otherwise, add the command id to the set
      commandNode.id.forEach((id) => {
        result.commandsById.set(id, commandNode);
      });
    }
  }
};
