import { strict as assert } from "assert";
import { RootParser } from "../parser/RootParser";
import { makeCstVisitor } from "../parser/visitor/makeCstVisitor";
import { validateCommands, idIsUnique } from "./validator";
import { makeBlockCommentTokens } from "../parser/lexer/makeBlockCommentTokens";
import { makeLineCommentToken } from "../parser/lexer/makeLineCommentToken";
import { Document } from "../Document";
import { CommandProcessors } from "./Processor";
import {
  IdRequiredAttributes,
  IdRequiredAttributesSchema,
  makeBlockCommand,
  makeBlockOrLineCommand,
  makeLineCommand,
  NoAttributes,
  NoAttributesSchema,
} from "../commands/Command";

describe("validator", () => {
  const commandProcessors: CommandProcessors = {
    "code-block": makeBlockCommand<IdRequiredAttributes>({
      name: "code-block",
      attributesSchema: IdRequiredAttributesSchema,
      rules: [idIsUnique],
      process(request) {
        // do nothing
      },
    }),
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
    const errors = validateCommands(result.commandNodes, {});
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
    const errors = validateCommands(result.commandNodes, commandProcessors);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toStrictEqual(
      "attribute list for 'code-block' command should be object"
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
    const errors = validateCommands(result.commandNodes, commandProcessors);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toStrictEqual(
      "attribute list for 'code-block' command should be object"
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
    const errors = validateCommands(result.commandNodes, commandProcessors);
    expect(errors.length).toBe(2);
    expect(errors[0].message).toStrictEqual(
      "attribute list for 'code-block' command should be object"
    );
    expect(errors[0].location).toStrictEqual({
      line: 2,
      column: 4,
      offset: 4,
    });
    expect(errors[1].message).toStrictEqual(
      "attribute list for 'code-block' command should be object"
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
    const errors = validateCommands(result.commandNodes, commandProcessors);
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
    const errors = validateCommands(result.commandNodes, commandProcessors);
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
    const errors = validateCommands(result.commandNodes, commandProcessors);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toStrictEqual(
      "attribute list for 'code-block' command should be object"
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
    const errors = validateCommands(result.commandNodes, commandProcessors);
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
    const errors = validateCommands(result.commandNodes, commandProcessors);
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

  it("validates block or line mode support on commands", () => {
    const commandProcessors: CommandProcessors = {
      lineOnlyCommand: makeLineCommand({
        name: "lineOnlyCommand",
        process(request) {
          // do nothing
        },
      }),
      blockOnlyCommand: makeBlockCommand<NoAttributes>({
        name: "blockOnlyCommand",
        attributesSchema: NoAttributesSchema,
        process(request) {
          // do nothing
        },
      }),
      blockOrLineCommand: makeBlockOrLineCommand({
        name: "blockOrLineCommand",
        attributesSchema: NoAttributesSchema,
        process(request) {
          // do nothing
        },
      }),
    };

    const parseResult = parser.parse(`:lineOnlyCommand-start:
:lineOnlyCommand-end:
:blockOnlyCommand:
:blockOrLineCommand:
:blockOrLineCommand-start:
:blockOrLineCommand-end:
`);
    expect(parseResult.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    assert(parseResult.cst !== undefined);
    const result = visitor.visit(parseResult.cst, source);
    const errors = validateCommands(result.commandNodes, commandProcessors);
    expect(errors).toStrictEqual([
      {
        component: "validator",
        location: {
          column: 1,
          line: 1,
          offset: 0,
        },
        message:
          "'lineOnlyCommand' cannot be used in block mode (i.e. with -start and -end)",
      },
      {
        component: "validator",
        location: {
          column: 1,
          line: 3,
          offset: 46,
        },
        message:
          "'blockOnlyCommand' cannot be used in single line mode (i.e. without -start and -end around a block)",
      },
    ]);
  });
});
