import { RootParser } from "../parser/RootParser";
import { makeCstVisitor } from "../parser/makeCstVisitor";
import { validateVisitorResult } from "../parser/validator";
import { makeBlockCommentTokens } from "../lexer/makeBlockCommentTokens";
import { makeLineCommentToken } from "../lexer/makeLineCommentToken";
import { BluehawkSource } from "../bluehawk";

describe("validator", () => {
  const source = new BluehawkSource({
    filePath: "",
    language: "",
    text: "",
  });

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
    const result = visitor.visit(cst, source);
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
    const result = visitor.visit(cst, source);
    const validateResult = validateVisitorResult(result);
    expect(validateResult.errors.length).toBe(1);
    expect(validateResult.errors[0].message).toStrictEqual(
      "missing ID for command: 'code-block'"
    );
    expect(validateResult.errors[0].location).toStrictEqual({
      line: 2,
      column: 4,
      offset: 4,
    });
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
    const result = visitor.visit(cst, source);
    const validateResult = validateVisitorResult(result);
    expect(validateResult.errors.length).toBe(1);
    expect(validateResult.errors[0].message).toStrictEqual(
      "missing ID for command: 'code-block'"
    );
    expect(validateResult.errors[0].location).toStrictEqual({
      line: 6,
      column: 4,
      offset: 80,
    });
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
    const result = visitor.visit(cst, source);
    const validateResult = validateVisitorResult(result);
    expect(validateResult.errors.length).toBe(2);
    expect(validateResult.errors[0].message).toStrictEqual(
      "missing ID for command: 'code-block'"
    );
    expect(validateResult.errors[0].location).toStrictEqual({
      line: 2,
      column: 4,
      offset: 4,
    });
    expect(validateResult.errors[1].message).toStrictEqual(
      "missing ID for command: 'code-block'"
    );
    expect(validateResult.errors[1].location).toStrictEqual({
      line: 6,
      column: 4,
      offset: 74,
    });
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
    const result = visitor.visit(cst, source);
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
    const result = visitor.visit(cst, source);
    const validateResult = validateVisitorResult(result);
    expect(validateResult.errors.length).toBe(1);
    expect(validateResult.errors[0].message).toStrictEqual(
      "duplicate ID 'totallyuniqueid' found"
    );
    expect(validateResult.errors[0].location).toStrictEqual({
      line: 6,
      column: 4,
      offset: 90,
    });
  });

  test("throws an error when attributes list lacks an id", () => {
    const tokens = lexer.tokenize(`
// :code-block-start: { notid: totallyuniqueid }
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
    const result = visitor.visit(cst, source);
    const validateResult = validateVisitorResult(result);
    expect(validateResult.errors.length).toBe(1);
    expect(validateResult.errors[0].message).toStrictEqual(
      "missing ID for command: 'code-block'"
    );
    expect(validateResult.errors[0].location).toStrictEqual({
      line: 2,
      column: 4,
      offset: 4,
    });
  });

  test("does not throw an error when attributes list contains an id", () => {
    const tokens = lexer.tokenize(`
// :code-block-start: { "id": "uniqueid" }
the quick brown fox jumped
// :code-block-end:

// :code-block-start: anotheruniqueid
the quick brown fox jumped
// :code-block-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    const validateResult = validateVisitorResult(result);
    expect(validateResult.errors.length).toBe(0);
  });

  test("throws an error when attributes list contains an id that duplicates another block's id", () => {
    const tokens = lexer.tokenize(`
// :code-block-start: { "id": "totallyuniqueid" }
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
    const result = visitor.visit(cst, source);
    const validateResult = validateVisitorResult(result);
    expect(validateResult.errors.length).toBe(1);
    expect(validateResult.errors[0].message).toStrictEqual(
      "duplicate ID 'totallyuniqueid' found"
    );
    expect(validateResult.errors[0].location).toStrictEqual({
      line: 6,
      column: 4,
      offset: 102,
    });
  });

  test("correctly locates code block", () => {
    const tokens = lexer.tokenize(`
// :code-block-start: { "id": "totallyuniqueid" }
the quick brown fox jumped
// :code-block-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    const validateResult = validateVisitorResult(result);
    expect(validateResult.commandsById.size).toBe(1);
    expect(
      validateResult.commandsById.get("totallyuniqueid").range
    ).toStrictEqual({
      start: {
        line: 2,
        column: 4,
        offset: 4,
      },
      end: {
        line: 4,
        column: 19,
        offset: 96,
      },
    });
  });
});
