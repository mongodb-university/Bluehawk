import { RootParser } from "./RootParser";
import { makeCstVisitor, VisitorResult, CommandNode, VisitorError } from "./makeCstVisitor";
import { ExecuteCommandRequest } from "vscode-languageserver";

interface ValidateCstResult {
    errors: VisitorError[];
}

export function validateVisitorResult(visitorResult: VisitorResult): ValidateCstResult {
    const validateResult = { errors: [], hasErrors: false };
    var context = { commandIds: new Set<String>() }
    visitorResult.commands.forEach((command) => {
        validateCst(command, context, validateResult);
    });
    return validateResult;
}

function validateCst(commandNode: CommandNode, context: ValidationContext, result: ValidateCstResult) {
    commandNode.children.forEach((child) => {
        validateCst(child, context, result);
    });
    const rules = {
        "code-block": [new idIsUnique(), new hasId()],
    };
    const rulesForCommand = rules[commandNode.commandName]
    if (rulesForCommand != undefined) {
        rulesForCommand.forEach((rule) => {rule.execute(commandNode, context, result)});
    }
    return {
        errors: result
    }
}

// Classes for working with rules

class ValidationContext {
    commandIds: Set<String>
}

interface Rule {
    execute(commandNode: CommandNode, context: ValidationContext, result: ValidateCstResult): any;
}

// rule implementations

class hasId implements Rule {
    execute(commandNode: CommandNode, context: ValidationContext, result: ValidateCstResult) {
        if (commandNode.id == undefined) {
            result.errors.push({location: commandNode.range.start, message: "missing ID on a code block"});
        }
    }
}

class idIsUnique implements Rule {
    execute(commandNode: CommandNode, context: ValidationContext, result: ValidateCstResult) {
        if (commandNode.id != undefined) {
            // if the command id already exists in the set of command ids, create a duplicate error
            if (context.commandIds.has(commandNode.id)) {
                result.errors.push({location: commandNode.range.start, message: "duplicate ID on a code block"});
            } else { // otherwise, add the command id to the set
                context.commandIds.add(commandNode.id);
            }
        }
    }
}
