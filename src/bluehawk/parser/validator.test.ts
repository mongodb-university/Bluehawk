import { strict as assert } from "assert";
import { RootParser } from "./RootParser";
import { makeCstVisitor } from "./visitor/makeCstVisitor";
import { validateTags, idIsUnique } from "./validator";
import { makeBlockCommentTokens } from "./lexer/makeBlockCommentTokens";
import { makeLineCommentToken } from "./lexer/makeLineCommentToken";
import { Document } from "../Document";
import { TagProcessors } from "../processor/Processor";
import {
  IdRequiredAttributes,
  IdRequiredAttributesSchema,
  makeBlockTag,
  makeBlockOrLineTag,
  makeLineTag,
  NoAttributes,
  NoAttributesSchema,
} from "../tags/Tag";

describe("validator", () => {
  const tagProcessors: TagProcessors = {
    snippet: makeBlockTag<IdRequiredAttributes>({
      name: "snippet",
      attributesSchema: IdRequiredAttributesSchema,
      shorthandArgsAttributeName: "id",
      rules: [idIsUnique],
      process(request) {
        // do nothing
      },
    }),
  };

  const source = new Document({
    path: "",
    text: "",
  });

  const parser = new RootParser([
    ...makeBlockCommentTokens(/\/\*/y, /\*\//y),
    makeLineCommentToken(/\/\//),
  ]);
  const { lexer } = parser;

  test("validates non-snippet tags without error", () => {
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
    const errors = validateTags(result.tagNodes, {});
    expect(errors.length).toBe(0);
  });

  test("throws an error when a snippet lacks an id", () => {
    const tokens = lexer.tokenize(`
// :snippet-start:
the quick brown fox jumped
// :snippet-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    const errors = validateTags(result.tagNodes, tagProcessors);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toStrictEqual(
      "attribute list for 'snippet' tag must be object"
    );
    expect(errors[0].location).toStrictEqual({
      line: 2,
      column: 4,
      offset: 4,
    });
  });

  test("throws a single error when just one snippet lacks an id", () => {
    const tokens = lexer.tokenize(`
// :snippet-start: valid
the quick brown fox jumped
// :snippet-end:

// :snippet-start:
the quick brown fox jumped
// :snippet-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    const errors = validateTags(result.tagNodes, tagProcessors);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toStrictEqual(
      "attribute list for 'snippet' tag must be object"
    );
    expect(errors[0].location).toStrictEqual({
      line: 6,
      column: 4,
      offset: 74,
    });
  });

  test("throws two errors when two snippets lack an id", () => {
    const tokens = lexer.tokenize(`
// :snippet-start:
the quick brown fox jumped
// :snippet-end:

// :snippet-start:
the quick brown fox jumped
// :snippet-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    const errors = validateTags(result.tagNodes, tagProcessors);
    expect(errors.length).toBe(2);
    expect(errors[0].message).toStrictEqual(
      "attribute list for 'snippet' tag must be object"
    );
    expect(errors[0].location).toStrictEqual({
      line: 2,
      column: 4,
      offset: 4,
    });
    expect(errors[1].message).toStrictEqual(
      "attribute list for 'snippet' tag must be object"
    );
    expect(errors[1].location).toStrictEqual({
      line: 6,
      column: 4,
      offset: 68,
    });
  });

  test("does not throw an error when a snippet has an id", () => {
    const tokens = lexer.tokenize(`
// :snippet-start: shindig
the quick brown fox jumped
// :snippet-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    const errors = validateTags(result.tagNodes, tagProcessors);
    expect(errors.length).toBe(0);
  });

  test("throws an error when two snippets share an id", () => {
    const tokens = lexer.tokenize(`
// :snippet-start: totallyuniqueid
the quick brown fox jumped
// :snippet-end:

// :snippet-start: totallyuniqueid
the quick brown fox jumped
// :snippet-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    const errors = validateTags(result.tagNodes, tagProcessors);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toStrictEqual(
      "duplicate ID 'totallyuniqueid' found"
    );
    expect(errors[0].location).toStrictEqual({
      line: 6,
      column: 4,
      offset: 84,
    });
  });

  test("throws an error when attributes list lacks an id", () => {
    const tokens = lexer.tokenize(`
// :snippet-start: { notid: totallyuniqueid }
the quick brown fox jumped
// :snippet-end:

// :snippet-start: totallyuniqueid
the quick brown fox jumped
// :snippet-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    const errors = validateTags(result.tagNodes, tagProcessors);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toStrictEqual(
      "attribute list for 'snippet' tag must be object"
    );
    expect(errors[0].location).toStrictEqual({
      line: 2,
      column: 4,
      offset: 4,
    });
  });

  test("does not throw an error when attributes list contains an id", () => {
    const tokens = lexer.tokenize(`
// :snippet-start: { "id": ["uniqueid"] }
the quick brown fox jumped
// :snippet-end:

// :snippet-start: anotheruniqueid
the quick brown fox jumped
// :snippet-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    const errors = validateTags(result.tagNodes, tagProcessors);
    expect(errors.length).toBe(0);
  });

  test("throws an error when attributes list contains an id that duplicates another block's id", () => {
    const tokens = lexer.tokenize(`
// :snippet-start: { "id": ["totallyuniqueid"] }
the quick brown fox jumped
// :snippet-end:

// :snippet-start: totallyuniqueid
the quick brown fox jumped
// :snippet-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    const errors = validateTags(result.tagNodes, tagProcessors);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toStrictEqual(
      "duplicate ID 'totallyuniqueid' found"
    );
    expect(errors[0].location).toStrictEqual({
      line: 6,
      column: 4,
      offset: 98,
    });
  });

  test("throws an error a tag that should only accept one id accepts more than one id", () => {
    const tokens = lexer.tokenize(`
// :snippet-start: id1 id2
the quick brown fox jumped
// :snippet-end:

// :snippet-start: totallyuniqueid
the quick brown fox jumped
// :snippet-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    const errors = validateTags(result.tagNodes, tagProcessors);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toStrictEqual(
      "attribute list for 'snippet' tag/id must NOT have more than 1 items"
    );
  });

  it("validates block or line mode support on tags", () => {
    const tagProcessors: TagProcessors = {
      lineOnlyTag: makeLineTag({
        name: "lineOnlyTag",
        process(request) {
          // do nothing
        },
      }),
      blockOnlyTag: makeBlockTag<NoAttributes>({
        name: "blockOnlyTag",
        attributesSchema: NoAttributesSchema,
        process(request) {
          // do nothing
        },
      }),
      blockOrLineTag: makeBlockOrLineTag({
        name: "blockOrLineTag",
        attributesSchema: NoAttributesSchema,
        process(request) {
          // do nothing
        },
      }),
    };

    const parseResult = parser.parse(`:lineOnlyTag-start:
:lineOnlyTag-end:
:blockOnlyTag:
:blockOrLineTag:
:blockOrLineTag-start:
:blockOrLineTag-end:
`);
    expect(parseResult.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    assert(parseResult.cst !== undefined);
    const result = visitor.visit(parseResult.cst, source);
    const errors = validateTags(result.tagNodes, tagProcessors);
    expect(errors).toStrictEqual([
      {
        component: "validator",
        location: {
          column: 1,
          line: 1,
          offset: 0,
        },
        message:
          "'lineOnlyTag' cannot be used in block mode (i.e. with -start and -end)",
      },
      {
        component: "validator",
        location: {
          column: 1,
          line: 3,
          offset: 38,
        },
        message:
          "'blockOnlyTag' cannot be used in single line mode (i.e. without -start and -end around a block)",
      },
    ]);
  });
});
