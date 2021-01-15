import { makeBlockCommentTokens } from "./lexer/makeBlockCommentTokens";
import { makeLineCommentToken } from "./lexer/makeLineCommentToken";
import { makeCstVisitor } from "./parser/makeCstVisitor";
import { CommandNode } from "./parser/CommandNode";
import { validateVisitorResult } from "./parser/validator";
import { RootParser } from "./parser/RootParser";
import { COMMAND_PATTERN } from "./lexer/tokens";
import { BluehawkSource } from "./BluehawkSource";

export interface Location {
  line: number;
  column: number;
  offset: number;
}

export interface Range {
  start: Location;
  end: Location;
}

export interface BluehawkError {
  message: string;
  location: Location;
}

export class BluehawkResult {
  errors: BluehawkError[];
  commands: CommandNode[];
  source: BluehawkSource;
}

export class Bluehawk {
  parsers = new Map<string, RootParser>();

  run(source: BluehawkSource): BluehawkResult {
    // First, quickly check to see if this even has any commands.
    if (!COMMAND_PATTERN.test(source.text.original)) {
      return {
        errors: [],
        commands: [],
        source,
      };
    }
    if (!this.parsers.has(source.language)) {
      this.parsers.set(
        source.language,
        new RootParser([
          // TODO: map source.language to block/line comment tokens
          ...makeBlockCommentTokens(/\/\*/y, /\*\//y),
          makeLineCommentToken(/\/\/ ?/y),
        ])
      );
    }
    const parser = this.parsers.get(source.language);
    const parseResult = parser.parse(source.text.toString());
    const visitor = makeCstVisitor(parser);
    const visitorResult = visitor.visit(parseResult.cst, source);
    const validateResult = validateVisitorResult(visitorResult);
    return {
      errors: [
        ...parseResult.errors,
        ...visitorResult.errors,
        ...validateResult.errors,
      ],
      commands: visitorResult.commands,
      source,
    };
  }
}
