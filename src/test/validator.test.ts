import { RootParser } from "../parser/RootParser";
import { makeCstVisitor } from "../parser/makeCstVisitor";
import { validateVisitorResult } from "../parser/validator";
import { makeBlockCommentTokens } from "../lexer/makeBlockCommentTokens";
import { makeLineCommentToken } from "../lexer/makeLineCommentToken";

describe("validator", () => {
    const parser = new RootParser([
        ...makeBlockCommentTokens(/\/\*/y, /\*\//y),
        makeLineCommentToken(/\/\//),
      ]);
    const { lexer } = parser;

    test("validates non-code-block commands without error", () => {
    const tokens = lexer.tokenize(`
// :a-start:
the quick brown fox jumped
// :a-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst);
    const validateResult = validateVisitorResult(result);
    expect(validateResult.errors.length).toBe(0);
  });

  test("throws an error when a code-block lacks an id", () => {
    const tokens = lexer.tokenize(`
// :code-block-start:
the quick brown fox jumped
// :code-block-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst);
    const validateResult = validateVisitorResult(result);
    expect(validateResult.errors.length).toBe(1);
    expect(validateResult.errors[0].error.message).toStrictEqual("line 2: missing ID on a code block")
  });

  test("throws a single error when just one code-block lacks an id", () => {
    const tokens = lexer.tokenize(`
// :code-block-start: valid
the quick brown fox jumped
// :code-block-end:

// :code-block-start:
the quick brown fox jumped
// :code-block-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst);
    const validateResult = validateVisitorResult(result);
    expect(validateResult.errors.length).toBe(1);
    expect(validateResult.errors[0].error.message).toStrictEqual("line 6: missing ID on a code block")
  });

  test("throws two errors when two code-blocks lack an id", () => {
    const tokens = lexer.tokenize(`
// :code-block-start:
the quick brown fox jumped
// :code-block-end:

// :code-block-start:
the quick brown fox jumped
// :code-block-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst);
    const validateResult = validateVisitorResult(result);
    expect(validateResult.errors.length).toBe(2);
    expect(validateResult.errors[0].error.message).toStrictEqual("line 2: missing ID on a code block")
    expect(validateResult.errors[1].error.message).toStrictEqual("line 6: missing ID on a code block")
  });

  test("does not throw an error when a code-block has an id", () => {
    const tokens = lexer.tokenize(`
// :code-block-start: shindig
the quick brown fox jumped
// :code-block-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst);
    const validateResult = validateVisitorResult(result);
    expect(validateResult.errors.length).toBe(0);
  });

  test("throws an error when two code-blocks share an id", () => {
    const tokens = lexer.tokenize(`
// :code-block-start: totallyuniqueid
the quick brown fox jumped
// :code-block-end:

// :code-block-start: totallyuniqueid
the quick brown fox jumped
// :code-block-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst);
    const validateResult = validateVisitorResult(result);
    expect(validateResult.errors.length).toBe(1);
    expect(validateResult.errors[0].error.message).toStrictEqual("line 6: duplicate ID on a code block")
  });
});