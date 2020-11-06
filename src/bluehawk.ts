import { makeBlockCommentTokens } from "./lexer/makeBlockCommentTokens";
import { makeLineCommentToken } from "./lexer/makeLineCommentToken";
import { BluehawkError, makeCstVisitor } from "./parser/makeCstVisitor";
import { validateVisitorResult } from "./parser/validator";
import { RootParser } from "./parser/RootParser";

export class BluehawkResult {
  errors: BluehawkError[];
}

export class Bluehawk {
  run(text: string): BluehawkResult {
    const parser = new RootParser([
      ...makeBlockCommentTokens(/\/\*/y, /\*\//y),
      makeLineCommentToken(/\/\//y),
    ]);
    const { lexer } = parser;
    const parseResult = parser.parse(text);
    const visitor = makeCstVisitor(parser);
    const visitorResult = visitor.visit(parseResult.cst);
    const validateResult = validateVisitorResult(visitorResult);
    return {
      errors: [
        ...parseResult.errors,
        ...visitorResult.errors,
        ...validateResult.errors,
      ],
    };
  }
}
