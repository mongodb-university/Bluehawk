import { RootParser } from "../parser/RootParser";

describe("parser", () => {
  const parser = new RootParser({});
  const { lexer } = parser;

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

  it("error", () => {
    const result = lexer.tokenize(`
// :code-block-start:
not ended code block
`);
    expect(result.errors.length).toBe(0);
    // "input" is a setter which will reset the parser's state
    parser.input = result.tokens;
    parser.annotatedText();
    expect(parser.errors[0]).toStrictEqual("");
  });
});
