import { RootParser } from "../parser/RootParser";

describe("parser", () => {
  const parser = new RootParser({
    blockCommentEndPattern: /\*\//,
    blockCommentStartPattern: /\/\*/,
    lineCommentPattern: /\/\//,
    canNestBlockComments: true,
  });
  const { lexer } = parser;
  it("rejects incomplete markup", () => {
    const result = lexer.tokenize(`
:code-block-start:
not ended code block
`);
    expect(result.errors.length).toBe(0);
    // "input" is a setter which will reset the parser's state
    parser.input = result.tokens;
    parser.annotatedText();
    expect(parser.errors[0].message).toStrictEqual(
      "3:21 blockCommand: After Newline, expected CommandEnd but found EOF"
    );
  });

  describe("chunk rule", () => {
    it("accepts no more than one newline at top level", () => {
      const result = lexer.tokenize(`some text
bad second line
`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.chunk();
      expect(parser.errors.map((error) => error.message)).toStrictEqual([
        "2:16 undefined: expecting EOF but found Newline",
      ]);
    });
  });

  describe("command rule", () => {
    it("accepts block commands", () => {
      const result = lexer.tokenize(`:block-command-start: attribute
  any text
  :block-command-end:`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.command();
      expect(parser.errors).toStrictEqual([]);
    });

    it("accepts line-commented block commands", () => {
      const result = lexer.tokenize(`// :block-command-start: attribute
any text
:block-command-end:`); // it doesn't care if you comment the end block
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.command();
      expect(parser.errors).toStrictEqual([]);
    });

    it("accepts line-commented block commands with inner line comments", () => {
      const result = lexer.tokenize(`// :block-command-start: attribute
// any text
// :block-command-end:`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.command();
      expect(parser.errors).toStrictEqual([]);
    });

    it("accepts regular commands", () => {
      const result = lexer.tokenize(`:some-command:`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.command();
      expect(parser.errors).toStrictEqual([]);
    });
  });

  describe("blockCommand rule", () => {
    it("does not have to start with a line comment", () => {
      const result = lexer.tokenize(`:block-command-start:
:block-command-end:`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.blockCommand();
      expect(parser.errors).toStrictEqual([]);
    });

    it("handles optional identifiers", () => {
      const result = lexer.tokenize(`:block-command-start: identifier
:block-command-end:`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.blockCommand();
      expect(parser.errors).toStrictEqual([]);
    });

    it("handles optional attribute lists (empty)", () => {
      // TODO: populated attribute lists
      const result = lexer.tokenize(`:block-command-start: {
}
:block-command-end:`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.blockCommand();
      expect(parser.errors).toStrictEqual([]);
    });

    it("handles inner chunks", () => {
      const result = lexer.tokenize(`:block-command-start: identifier
// this is a chunk
// :some-command:
:some-command-start:
:some-command-end:
/* block comment */
:block-command-end:`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.blockCommand();
      expect(parser.errors).toStrictEqual([]);
    });
  });

  describe("blockComment rule", () => {
    it("ignores line comments in block comments", () => {
      const result = lexer.tokenize(`/* // */`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.blockComment();
      expect(parser.errors).toStrictEqual([]);
    });
  });

  describe("annotatedText rule", () => {
    it("handles annotated text", () => {
      const result = lexer.tokenize(`
this is ignored
:some-command-start:
this is in the command
:some-command-end:
`);
      expect(result.errors.length).toBe(0);
      expect(result.tokens.length).toBe(7);
      // "input" is a setter which will reset the parser's state
      parser.input = result.tokens;
      parser.annotatedText();
      expect(parser.errors).toStrictEqual([]);
    });

    it("handles non-markup text", () => {
      const result = lexer.tokenize(`
this is ignored
this is not bluehawk markup
...so whatever
`);
      expect(result.errors.length).toBe(0);
      expect(result.tokens.length).toBe(4); // newlines
      // "input" is a setter which will reset the parser's state
      parser.input = result.tokens;
      parser.annotatedText();
      expect(parser.errors).toStrictEqual([]);
    });

    it("handles empty command blocks with ids", () => {
      const result = lexer.tokenize(`
:some-command-start: label
:some-command-end:
`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.annotatedText();
      expect(parser.errors).toStrictEqual([]);
    });

    it("allows multiple line comments before block commands", () => {
      const result = lexer.tokenize(`
// some commented code // :some-command-start:
:some-command-end:
`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.annotatedText();
      expect(parser.errors).toStrictEqual([]);
    });

    it("allows one command after another", () => {
      // No reason to disallow this
      const result = lexer.tokenize(`
:some-command: :some-other-command:
`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.annotatedText();
      expect(parser.errors.length).toBe(0);
    });

    it("accepts one block command after another", () => {
      // Not sure why this should be allowed or disallowed
      // so allow it
      const result = lexer.tokenize(`
:some-command-start:
:some-command-end::some-other-command-start:
:some-other-command-end:
`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.annotatedText();
      expect(parser.errors.length).toBe(0);
    });

    it("handles comments and comments with commands", () => {
      const result = lexer.tokenize(`/* */
// :some-command:
/*
// not a command
// :command-start: ok
:command-end:
*/
`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.annotatedText();
      expect(parser.errors.length).toBe(0);
    });

    it("rejects block commands that straddle comment blocks", () => {
      const result = lexer.tokenize(`
:command-start:
/* start comment block
:command-end: // this should not work
*/ end comment block
`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.annotatedText();
      expect(parser.errors[0].message).toBe(
        "3:23 blockComment: After Newline, expected BlockCommentEnd but found CommandEnd"
      );
    });

    it("accepts any number of comment tokens", () => {
      const result = lexer.tokenize(`
/////////////////
/* // // // // // */
// :some-command: // // // //
// /* */ //
`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.annotatedText();
      expect(parser.errors.length).toBe(0);
    });
  });

  describe("without nested block comments", () => {
    const parser = new RootParser({
      blockCommentEndPattern: /\*\//,
      blockCommentStartPattern: /\/\*/,
      lineCommentPattern: /\/\//,
      canNestBlockComments: false,
    });
    const { lexer } = parser;

    it("cannot nest block comments", () => {
      const result = lexer.tokenize(`/* /* */ */`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.annotatedText();
      expect(parser.errors[0].message).toBe(
        "1:1 blockComment: After BlockCommentStart, expected BlockCommentEnd but found BlockCommentStart"
      );
    });

    it("allows everything but nested block comments", () => {
      const result = lexer.tokenize(`
/*
  anything but another comment block start can go here
  // :some-command:
  :some-command-start: {}
  :some-command-end:
  :some-command-start: id
  :some-command-end:
// /* <-- fail
*/
`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.annotatedText();
      expect(parser.errors.map((error) => error.message)).toStrictEqual([
        "9:1 blockComment: After LineComment, expected BlockCommentEnd but found BlockCommentStart",
      ]);
    });
  });
});
