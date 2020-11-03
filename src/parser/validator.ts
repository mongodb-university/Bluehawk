import { VisitorResult, CommandNode, VisitorError } from "./makeCstVisitor";

interface ValidateCstResult {
  errors: VisitorError[];
  commandIds: Set<string>;
}

export function validateVisitorResult(
  visitorResult: VisitorResult
): ValidateCstResult {
  const validateResult = { errors: [], commandIds: new Set<string>() };
  visitorResult.commands.forEach((command) => {
    validateCst(command, validateResult);
  });
  return validateResult;
}

function validateCst(
  commandNode: CommandNode,
  result: ValidateCstResult
): void {
  commandNode.children.forEach((child) => {
    validateCst(child, result);
  });
  const rules: { [k: string]: Rule[] } = {
    "code-block": [idIsUnique, hasId],
  };
  const rulesForCommand = rules[commandNode.commandName];
  if (rulesForCommand !== undefined) {
    rulesForCommand.forEach((rule) => {
      rule(commandNode, result);
    });
  }
}

// classes for working with rules

type Rule = (commandNode: CommandNode, result: ValidateCstResult) => void;

// rule implementations

const idIsUnique: Rule = (
  commandNode: CommandNode,
  result: ValidateCstResult
) => {
  if (commandNode.id !== undefined) {
    // if the command id already exists in the set of command ids, create a duplicate error
    if (result.commandIds.has(commandNode.id)) {
      result.errors.push({
        location: commandNode.range.start,
        message: "duplicate ID on a code block",
      });
    } else {
      // otherwise, add the command id to the set
      result.commandIds.add(commandNode.id);
    }
  }
};

const hasId: Rule = (commandNode: CommandNode, result: ValidateCstResult) => {
  if (commandNode.id === undefined) {
    result.errors.push({
      location: commandNode.range.start,
      message: "missing ID on a code block",
    });
  }
};
