import { RootParser } from "../parser/RootParser";
import { makeCstVisitor } from "../parser/makeCstVisitor";

describe("visitor", () => {
  const parser = new RootParser({
    blockCommentEndPattern: /\*\\/,
    blockCommentStartPattern: /\/\*/,
    lineCommentPattern: /\/\//,
  });
  const { lexer } = parser;

  it("can be constructed", () => {
    const visitor = makeCstVisitor(parser);
    const result = lexer.tokenize(`
this is annotated text
:command: attribute
:no-attribute-command:
:this-is-a-block-command-start: attribute
annotated text
:this-is-a-block-command-end:
/* this is a block comment */
// this is a line comment
`);
    expect(result.errors.length).toBe(0);
    expect(result.tokens.length).toBe(16);
    parser.input = result.tokens;
    const cst = parser.annotatedText();
    visitor.visit(cst);
  });
});
