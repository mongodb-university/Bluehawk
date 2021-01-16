import { CommandNode } from "../parser/CommandNode";
import { BluehawkError } from "../BluehawkError";
import { flatten } from "../parser/flatten";
import { CommandProcessors } from "./Processor";

export interface ValidateCstResult {
  errors: BluehawkError[];
  commandsById: Map<string, CommandNode>;
}

// A rule function is registered for a given command name and checks that the
// given command node conforms to the specification of that command. Errors can
// be reported into the result.errors array.
export type Rule = (
  commandNode: CommandNode,
  result: ValidateCstResult
) => void;

export function validateCommands(
  commandNodes: CommandNode[],
  commandProcessorMap: CommandProcessors
): BluehawkError[] {
  const validateResult = {
    errors: [],
    commandsById: new Map<string, CommandNode>(),
  };
  flatten({ children: commandNodes } as CommandNode).forEach((commandNode) => {
    const processor = commandProcessorMap[commandNode.commandName];
    if (processor === undefined) {
      // TODO: warn unknown command
      return;
    }
    processor.rules.forEach((rule) => {
      rule(commandNode, validateResult);
    });
  });
  return validateResult.errors;
}

// standard rule implementations

export const idIsUnique: Rule = (
  commandNode: CommandNode,
  result: ValidateCstResult
) => {
  if (commandNode.id !== undefined) {
    // if the command id already exists in the set of command ids, create a duplicate error
    if (result.commandsById.has(commandNode.id)) {
      result.errors.push({
        component: "validator",
        location: commandNode.range.start,
        message: `duplicate ID '${commandNode.id}' found`,
      });
    } else {
      // otherwise, add the command id to the set
      result.commandsById.set(commandNode.id, commandNode);
    }
  }
};

export const hasId: Rule = (
  commandNode: CommandNode,
  result: ValidateCstResult
) => {
  if (commandNode.id === undefined) {
    result.errors.push({
      component: "validator",
      location: commandNode.range.start,
      message: `missing ID for command: '${commandNode.commandName}'`,
    });
  }
};
