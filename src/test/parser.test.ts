import { RootParser } from "../parser/RootParser";

describe("parser", () => {
  const parser = new RootParser({});
  const { lexer } = parser;

  it("passes", () => {
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
    parser.annotatedText(0);
    expect(parser.errors).toStrictEqual([]);
  });
});
