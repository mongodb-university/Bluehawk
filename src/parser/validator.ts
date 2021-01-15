import { VisitorResult } from "./makeCstVisitor";
import { CommandNode } from "./CommandNode";
import { BluehawkError } from "../bluehawk";

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

export function validateVisitorResult(
  visitorResult: VisitorResult
): ValidateCstResult {
  const validateResult = {
    errors: [],
    commandsById: new Map<string, CommandNode>(),
  };
  visitorResult.commands.forEach((command) => {
    validateCst(command, validateResult);
  });
  return validateResult;
}

function validateCst(
  commandNode: CommandNode,
  result: ValidateCstResult
): void {
  commandNode.children?.forEach((child) => {
    validateCst(child, result);
  });
  const rules: { [k: string]: Rule[] } = {
    "code-block": [idIsUnique, hasId],
    hide: [],
  };
  const rulesForCommand = rules[commandNode.commandName];
  if (rulesForCommand === undefined) {
    /*
    result.errors.push({
      location: commandNode.range.start,
      message: `unknown command '${commandNode.commandName}'`,
    });
    */
    return;
  }

  rulesForCommand.forEach((rule) => {
    rule(commandNode, result);
  });
}

// rule implementations

const idIsUnique: Rule = (
  commandNode: CommandNode,
  result: ValidateCstResult
) => {
  if (commandNode.id !== undefined) {
    // if the command id already exists in the set of command ids, create a duplicate error
    if (result.commandsById.has(commandNode.id)) {
      result.errors.push({
        location: commandNode.range.start,
        message: `duplicate ID '${commandNode.id}' found`,
      });
    } else {
      // otherwise, add the command id to the set
      result.commandsById.set(commandNode.id, commandNode);
    }
  }
};

const hasId: Rule = (commandNode: CommandNode, result: ValidateCstResult) => {
  if (commandNode.id === undefined) {
    result.errors.push({
      location: commandNode.range.start,
      message: `missing ID for command: '${commandNode.commandName}'`,
    });
  }
};
