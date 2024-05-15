import { makeLexer } from "./makeLexer";
import { TAG_PATTERN } from "./tokens";
import { makeBlockCommentTokens } from "./makeBlockCommentTokens";
import { makeLineCommentToken } from "./makeLineCommentToken";

describe("lexer", () => {
  const lexer = makeLexer([
    ...makeBlockCommentTokens(/\/\*/y, /\*\//y),
    makeLineCommentToken(/\/\//y),
  ]);

  it("has no definition errors", () => {
    expect(lexer.lexerDefinitionErrors).toStrictEqual([]);
  });

  it("tokenizes empty strings", () => {
    const result = lexer.tokenize("");
    expect(result.errors).toStrictEqual([]);
    expect(result.groups).toStrictEqual({});
    expect(result.tokens).toStrictEqual([]);
  });

  it("skips white space", () => {
    const result = lexer.tokenize("     ");
    expect(result.errors).toStrictEqual([]);
    expect(result.groups).toStrictEqual({});
    expect(result.tokens).toStrictEqual([]);
  });

  it("tokenizes bluehawk markup", () => {
    const result = lexer.tokenize(`
// :snippet-start: some-id
this is bluehawk
// :remove-start:
this is hidden
// :replace-with:
this is used to replace
// :remove-end:
// :snippet-end:
`);
    expect(result.errors).toStrictEqual([]);
    expect(result.groups).toStrictEqual({});
    expect(result.tokens.length).toBe(20);
    const tokenNames = result.tokens.map((token) => token.tokenType.name);
    expect(tokenNames).toStrictEqual([
      "Newline",
      "LineComment",
      "TagStart",
      "Identifier",
      "Newline",
      "Newline",
      "LineComment",
      "TagStart",
      "Newline",
      "Newline",
      "LineComment",
      "Tag",
      "Newline",
      "Newline",
      "LineComment",
      "TagEnd",
      "Newline",
      "LineComment",
      "TagEnd",
      "Newline",
    ]);
  });

  it("does not misinterpret C++ syntax as tokens", () => {
    const result = lexer.tokenize(`SomeClass::state::something;`);
    expect(result.errors.length).toBe(0);
    const tokenNames = result.tokens.map((token) => token.tokenType.name);
    expect(tokenNames).toBeNull;
  });

  it("does not make a token from content that starts with ::", () => {
    const result = lexer.tokenize(`::SomeClass::state::something;`);
    expect(result.errors.length).toBe(0);
    const tokenNames = result.tokens.map((token) => token.tokenType.name);
    expect(tokenNames).toBeNull;
  });

  it("does not make a token from content that ends with ::", () => {
    const result = lexer.tokenize(`SomeClass::state::something::`);
    expect(result.errors.length).toBe(0);
    const tokenNames = result.tokens.map((token) => token.tokenType.name);
    expect(tokenNames).toBeNull;
  });

  it("does not make a token from content that starts and ends with ::", () => {
    const result = lexer.tokenize(`::SomeClass::state::something::`);
    expect(result.errors.length).toBe(0);
    const tokenNames = result.tokens.map((token) => token.tokenType.name);
    expect(tokenNames).toBeNull;
  });

  it("does not make a token with a space in the state tag", () => {
    const result = lexer.tokenize(`
// :state -start: state-identifier
SomeClass::state::something;
// :state-end:
    `);
    expect(result.errors.length).toBe(0);
    const tokenNames = result.tokens.map((token) => token.tokenType.name);
    expect(tokenNames).toBeNull;
  });

  it("does not make a token with a space after the start colon", () => {
    const result = lexer.tokenize(`
// : state-start: state-identifier
SomeClass::state::something;
// :state-end:
    `);
    expect(result.errors.length).toBe(0);
    const tokenNames = result.tokens.map((token) => token.tokenType.name);
    expect(tokenNames).toBeNull;
  });

  it("Correctly tokenizes C++ syntax within a tag", () => {
    const result = lexer.tokenize(`
// :state-start: state-identifier
SomeClass::state::something;
// :state-end:
`);
    expect(result.errors.length).toBe(0);
    const tokenNames = result.tokens.map((token) => token.tokenType.name);
    expect(tokenNames).toStrictEqual([
      "Newline",
      "LineComment",
      "TagStart",
      "Identifier",
      "Newline",
      "Newline",
      "LineComment",
      "TagEnd",
      "Newline",
    ]);
  });
});

describe("custom comment lexer", () => {
  it("accepts arbitrary line comment tokens", () => {
    const bashLexer = makeLexer([makeLineCommentToken(/#/y)]);
    expect(bashLexer.lexerDefinitionErrors).toStrictEqual([]);

    const result = bashLexer.tokenize(`
# this is a bash comment
// this is not a comment
/* this is just text */
<!-- just text -->
`);
    expect(result.errors).toStrictEqual([]);
    const tokenLines = result.tokens
      .filter((token) => token.tokenType.name !== "Newline")
      .map((token) => token.startLine);
    expect(tokenLines).toStrictEqual([2]);
    const tokenNames = result.tokens.map((token) => token.tokenType.name);
    expect(tokenNames).toStrictEqual([
      "Newline",
      "LineComment",
      "Newline",
      "Newline",
      "Newline",
      "Newline",
    ]);
  });

  it("accepts block comment tokens", () => {
    const htmlLexer = makeLexer([...makeBlockCommentTokens(/<!--/y, /-->/y)]);
    expect(htmlLexer.lexerDefinitionErrors).toStrictEqual([]);

    const result = htmlLexer.tokenize(`
# this is not a comment
// this is not a comment
/* this is just text */
<!-- this is a block comment -->
`);
    expect(result.errors).toStrictEqual([]);
    const tokens = result.tokens.filter(
      (token) => token.tokenType.name !== "Newline"
    );
    const tokenLines = tokens.map((token) => token.startLine);
    expect(tokenLines).toStrictEqual([5, 5]);
    const tokenNames = tokens.map((token) => token.tokenType.name);
    expect(tokenNames).toStrictEqual(["BlockCommentStart", "BlockCommentEnd"]);
  });

  it("rejects comment patterns that conflict with other tokens", () => {
    expect(() => {
      try {
        makeLexer([makeLineCommentToken(TAG_PATTERN)]);
      } catch (e) {
        expect(e.message).toBe(`Errors detected in definition of Lexer:
        The same RegExp pattern ->/(?<!:):([A-z0-9-]+):(?!:)[^\\S\\r\\n]*/<-has been used in all of the following Token Types: Tag, LineComment <-`);
      }
    });
  });
});

describe("tag attributes lexer", () => {
  const lexer = makeLexer([
    ...makeBlockCommentTokens(/\/\*/y, /\*\//y),
    makeLineCommentToken(/\/\//y),
  ]);

  it("handles JSON attribute lists after tags", () => {
    const result = lexer.tokenize(`:some-tag-start: {
  "a": 1,
  "b": true,
  "c": false,
  "d": [1, 2, 3],
  "e": {"doesn't have to be 100% valid json": "but it will still be tokenized correctly"}
}
this is not parsed
:some-tag-end:
`);
    expect(result.errors).toStrictEqual([]);
    expect(result.groups).toStrictEqual({});
    const tokenNames = result.tokens
      .filter((token) => token.tokenType.name !== "Newline")
      .map((token) => token.tokenType.name);
    expect(tokenNames).toStrictEqual([
      "TagStart",
      "AttributeListStart",
      "JsonStringLiteral",
      "JsonStringLiteral",
      "JsonStringLiteral",
      "JsonStringLiteral",
      "JsonStringLiteral",
      "AttributeListStart",
      "JsonStringLiteral",
      "JsonStringLiteral",
      "AttributeListEnd",
      "AttributeListEnd",
      "TagEnd",
    ]);
  });

  it("accepts a tag identifier as shorthand for attributes list", () => {
    const result = lexer.tokenize(`
:some-tag-start: some-id
this is ignored
:some-tag-end:
`);
    expect(result.errors).toStrictEqual([]);
    expect(result.groups).toStrictEqual({});
    const tokenNames = result.tokens.map((token) => token.tokenType.name);
    expect(tokenNames).toStrictEqual([
      "Newline",
      "TagStart",
      "Identifier",
      "Newline",
      "Newline",
      "TagEnd",
      "Newline",
    ]);
  });

  it("diagnoses invalid identifiers", () => {
    // Identifiers may not start with a number or dash nor contain invalid characters
    const result = lexer.tokenize(`
:some-tag-start: 9 - '
this is ignored
:some-tag-end:
`);
    const errorMessages = result.errors.map((error) => error.message);
    expect(errorMessages).toStrictEqual([
      "unexpected character: ->9<- at offset: 18, skipped 1 characters.",
      "unexpected character: ->-<- at offset: 20, skipped 1 characters.",
      "unexpected character: ->'<- at offset: 22, skipped 1 characters.",
    ]);
    const tokenNames = result.tokens.map((token) => token.tokenType.name);
    expect(tokenNames).toStrictEqual([
      "Newline",
      "TagStart",
      "Newline",
      "Newline",
      "TagEnd",
      "Newline",
    ]);
  });

  it("does not diagnose on unclosed attributes lists", () => {
    const result = lexer.tokenize(`
:some-tag-start: {
forgot to close
:some-tag-end:
`);
    const tokenNames = result.tokens.map((token) => token.tokenType.name);
    expect(tokenNames).toStrictEqual([
      "Newline",
      "TagStart",
      "AttributeListStart",
      "Newline",
      "Newline",
      "Newline",
      // Note it never switched back to root mode, so it does not find a
      // TagEnd
    ]);
    const errorMessages = result.errors.map((error) => error.message);
    expect(errorMessages).toStrictEqual([]);
  });

  it("accepts comment tokens in attributes lists", () => {
    const result = lexer.tokenize(`
:some-tag-start: {
// /* */ //
}
:some-tag-end:
`);
    const tokenNames = result.tokens.map((token) => token.tokenType.name);
    expect(tokenNames).toStrictEqual([
      "Newline",
      "TagStart",
      "AttributeListStart",
      "Newline",
      "LineComment",
      "BlockCommentStart",
      "BlockCommentEnd",
      "LineComment",
      "Newline",
      "AttributeListEnd",
      "Newline",
      "TagEnd",
      "Newline",
    ]);
    const errorMessages = result.errors.map((error) => error.message);
    expect(errorMessages).toStrictEqual([]);
  });

  it("does not misinterpret comment tokens in json strings", () => {
    const result = lexer.tokenize(`:some-tag-start: {"// /* */"}
:some-tag-end:
`);
    expect(result.errors.length).toBe(0);
    const tokenNames = result.tokens.map((token) => token.tokenType.name);
    expect(tokenNames).toStrictEqual([
      "TagStart",
      "AttributeListStart",
      "JsonStringLiteral",
      // NOT LineComment, BlockCommentStart, or BlockCommentEnd
      "AttributeListEnd",
      "Newline",
      "TagEnd",
      "Newline",
    ]);
  });
});
