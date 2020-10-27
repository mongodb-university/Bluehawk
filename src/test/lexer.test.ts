import { makeLexer } from "../lexer/makeLexer";
import { COMMAND_PATTERN } from "../lexer/tokens";

describe("lexer", () => {
  const lexer = makeLexer();

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

  it("finds C-style comment lines by default", () => {
    const result = lexer.tokenize(`
// this is a comment
`);
    expect(result.errors).toStrictEqual([]);
    expect(result.groups).toStrictEqual({});
    expect(result.tokens[0].tokenType.name).toStrictEqual("Newline");
  });

  it("tokenizes bluehawk markup", () => {
    const result = lexer.tokenize(`
// :code-block-start: some-id
this is bluehawk
// :hide-start:
this is hidden
// :replace-with:
this is used to replace
// :hide-end:
// :code-block-end:
`);
    expect(result.errors).toStrictEqual([]);
    expect(result.groups).toStrictEqual({});
    expect(result.tokens.length).toBe(20);
    const tokenNames = result.tokens.map((token) => token.tokenType.name);
    expect(tokenNames).toStrictEqual([
      "Newline",
      "LineComment",
      "CommandStart",
      "Identifier",
      "Newline",
      "Newline",
      "LineComment",
      "CommandStart",
      "Newline",
      "Newline",
      "LineComment",
      "Command",
      "Newline",
      "Newline",
      "LineComment",
      "CommandEnd",
      "Newline",
      "LineComment",
      "CommandEnd",
      "Newline",
    ]);
  });
});

describe("custom comment lexer", () => {
  it("accepts arbitrary line comment patterns", () => {
    const bashLexer = makeLexer({
      lineCommentPattern: /#/,
    });
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

  it("accepts block comment patterns", () => {
    const htmlLexer = makeLexer({
      blockCommentStartPattern: /<!--/,
      blockCommentEndPattern: /-->/,
    });
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
      makeLexer({
        lineCommentPattern: COMMAND_PATTERN,
      });
    }).toThrowError(`Errors detected in definition of Lexer:
The same RegExp pattern ->/:([A-z0-9-]+):/<-has been used in all of the following Token Types: Command, LineComment <-`);
  });
});

describe("command attributes lexer", () => {
  const lexer = makeLexer();

  it("handles JSON attribute lists after commands", () => {
    const result = lexer.tokenize(`:some-command-start: {
  "a": 1,
  "b": true,
  "c": false,
  "d": [1, 2, 3],
  "e": {"doesn't have to be 100% valid json": "but it will still be tokenized correctly"}
}
this is not parsed
:some-command-end:
`);
    expect(result.errors).toStrictEqual([]);
    expect(result.groups).toStrictEqual({});
    const tokenNames = result.tokens
      .filter((token) => token.tokenType.name !== "Newline")
      .map((token) => token.tokenType.name);
    expect(tokenNames).toStrictEqual([
      "CommandStart",
      "AttributeListStart",
      "StringLiteral",
      "Colon",
      "NumberLiteral",
      "Comma",
      "StringLiteral",
      "Colon",
      "True",
      "Comma",
      "StringLiteral",
      "Colon",
      "False",
      "Comma",
      "StringLiteral",
      "Colon",
      "LSquare",
      "NumberLiteral",
      "Comma",
      "NumberLiteral",
      "Comma",
      "NumberLiteral",
      "RSquare",
      "Comma",
      "StringLiteral",
      "Colon",
      "LCurly",
      "StringLiteral",
      "Colon",
      "StringLiteral",
      "RCurly",
      "AttributeListEnd",
      "CommandEnd",
    ]);
  });

  it("accepts a command identifier as shorthand for attributes list", () => {
    const result = lexer.tokenize(`
:some-command-start: some-id
this is ignored
:some-command-end:
`);
    expect(result.errors).toStrictEqual([]);
    expect(result.groups).toStrictEqual({});
    const tokenNames = result.tokens.map((token) => token.tokenType.name);
    expect(tokenNames).toStrictEqual([
      "Newline",
      "CommandStart",
      "Identifier",
      "Newline",
      "Newline",
      "CommandEnd",
      "Newline",
    ]);
  });

  it("rejects invalid identifiers", () => {
    // Identifiers may not start with a number or dash nor contain invalid characters
    const result = lexer.tokenize(`
:some-command-start: 9 - '
this is ignored
:some-command-end:
`);
    const errorMessages = result.errors.map((error) => error.message);
    expect(errorMessages).toStrictEqual([
      "unexpected character: ->9<- at offset: 22, skipped 1 characters.",
      "unexpected character: ->-<- at offset: 24, skipped 1 characters.",
      "unexpected character: ->'<- at offset: 26, skipped 1 characters.",
    ]);
    const tokenNames = result.tokens.map((token) => token.tokenType.name);
    expect(tokenNames).toStrictEqual([
      "Newline",
      "CommandStart",
      "Newline",
      "Newline",
      "CommandEnd",
      "Newline",
    ]);
  });

  it("diagnoses invalid identifiers", () => {
    // Identifiers may not start with a number or dash nor contain invalid characters
    const result = lexer.tokenize(`
:some-command-start: 9 - '
this is ignored
:some-command-end:
`);
    const errorMessages = result.errors.map((error) => error.message);
    expect(errorMessages).toStrictEqual([
      "unexpected character: ->9<- at offset: 22, skipped 1 characters.",
      "unexpected character: ->-<- at offset: 24, skipped 1 characters.",
      "unexpected character: ->'<- at offset: 26, skipped 1 characters.",
    ]);
    const tokenNames = result.tokens.map((token) => token.tokenType.name);
    expect(tokenNames).toStrictEqual([
      "Newline",
      "CommandStart",
      "Newline",
      "Newline",
      "CommandEnd",
      "Newline",
    ]);
  });

  it("diagnoses on unclosed attributes lists", () => {
    // Identifiers may not start with a number or dash nor contain invalid characters
    const result = lexer.tokenize(`
:some-command-start: {
forgot to close
:some-command-end:
`);
    const errorMessages = result.errors.map((error) => error.message);
    expect(errorMessages).toStrictEqual([
      "unexpected character: ->f<- at offset: 24, skipped 6 characters.",
      "unexpected character: ->t<- at offset: 31, skipped 2 characters.",
      "unexpected character: ->c<- at offset: 34, skipped 5 characters.",
      "unexpected character: ->s<- at offset: 41, skipped 16 characters.",
    ]);
    const tokenNames = result.tokens.map((token) => token.tokenType.name);
    expect(tokenNames).toStrictEqual([
      "Newline",
      "CommandStart",
      "AttributeListStart",
      "Colon",
      "Colon",
    ]);
  });
});
