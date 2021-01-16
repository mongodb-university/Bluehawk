import { RootParser } from "../parser/RootParser";
import { makeCstVisitor } from "../parser/visitor/makeCstVisitor";
import { validateCommands, idIsUnique, hasId } from "./validator";
import { makeBlockCommentTokens } from "../parser/lexer/makeBlockCommentTokens";
import { makeLineCommentToken } from "../parser/lexer/makeLineCommentToken";
import { Document } from "../Document";
import { CommandProcessors } from "./Processor";

describe("validator", () => {
  const commandProcessors: CommandProcessors = {
    "code-block": {
      process: () => {
        return;
      },
      rules: [idIsUnique, hasId],
    },
  };

  const source = new Document({
    path: "",
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
    const errors = validateCommands(result.commands, {});
    expect(errors.length).toBe(0);
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
    const errors = validateCommands(result.commands, commandProcessors);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toStrictEqual(
      "missing ID for command: 'code-block'"
    );
    expect(errors[0].location).toStrictEqual({
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
    const errors = validateCommands(result.commands, commandProcessors);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toStrictEqual(
      "missing ID for command: 'code-block'"
    );
    expect(errors[0].location).toStrictEqual({
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
    const errors = validateCommands(result.commands, commandProcessors);
    expect(errors.length).toBe(2);
    expect(errors[0].message).toStrictEqual(
      "missing ID for command: 'code-block'"
    );
    expect(errors[0].location).toStrictEqual({
      line: 2,
      column: 4,
      offset: 4,
    });
    expect(errors[1].message).toStrictEqual(
      "missing ID for command: 'code-block'"
    );
    expect(errors[1].location).toStrictEqual({
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
    const errors = validateCommands(result.commands, commandProcessors);
    expect(errors.length).toBe(0);
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
    const errors = validateCommands(result.commands, commandProcessors);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toStrictEqual(
      "duplicate ID 'totallyuniqueid' found"
    );
    expect(errors[0].location).toStrictEqual({
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
    const errors = validateCommands(result.commands, commandProcessors);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toStrictEqual(
      "missing ID for command: 'code-block'"
    );
    expect(errors[0].location).toStrictEqual({
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
    const errors = validateCommands(result.commands, commandProcessors);
    expect(errors.length).toBe(0);
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
    const errors = validateCommands(result.commands, commandProcessors);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toStrictEqual(
      "duplicate ID 'totallyuniqueid' found"
    );
    expect(errors[0].location).toStrictEqual({
      line: 6,
      column: 4,
      offset: 102,
    });
  });
});
