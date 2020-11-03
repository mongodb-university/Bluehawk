import { RootParser } from "../parser/RootParser";
import { makeCstVisitor, VisitorResult, CommandNode } from "../parser/makeCstVisitor";

interface validateCSTResult {
    errors: ValidateCSTError[];
    hasErrors: boolean;
}

interface ValidateCSTError {
    error: Error,
}

export function validateVisitorResult(visitorResult: VisitorResult): validateCSTResult {
    var validateResult = { errors: [], hasErrors: false};
    var idSet = new Set<String>();
    visitorResult.commands.forEach((command) => {
        validateCST(command, validateResult, idSet);
    });
    return validateResult;
}

function validateCST(commandNode: CommandNode, errors: validateCSTResult, idSet: Set<String>) {
    commandNode.children.forEach((child) => {
        validateCST(child, errors, idSet);
    });
    codeBlockHasID(commandNode, errors);
    idIsUnique(commandNode, errors, idSet);
    return {
        errors: errors,
        hasErrors: errors.errors.length > 0
    }
}

function codeBlockHasID(commandNode: CommandNode, errors: validateCSTResult) {
    if (commandNode.commandName == "code-block") {
        if (commandNode.id == undefined) {
            errors.errors.push({error: {name: "code-block ID missing", message: "line " + commandNode.range.start.line + ": missing ID on a code block"}});
            errors.hasErrors = true;
        }
    }
}

function idIsUnique(commandNode: CommandNode, errors: validateCSTResult, idSet: Set<String>) {
    if (commandNode.commandName == "code-block") {
        if (commandNode.id != undefined) {
            if (idSet.has(commandNode.id)) {
                errors.errors.push({error: {name: "code-block ID duplicate", message: "line " + commandNode.range.start.line + ": duplicate ID on a code block"}});
            }
            idSet.add(commandNode.id);
        }
    }
}
