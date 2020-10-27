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
    const visitor = makeCstVisitor(parser);
    const cst = parser.annotatedText();
    visitor.visit(cst);
  });

  it("detects mismatched command names", () => {
    const tokens = lexer.tokenize(`
:this-is-a-command-start:
:this-is-a-different-command-end:`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors.length).toBe(0);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst);
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].message).toBe(
      "Unexpected this-is-a-different-command-end closing this-is-a-command-start"
    );
  });

  it("supports nested commands", () => {
    const tokens = lexer.tokenize(`
:A-start:
  :B-start:
    :C-start:
    :C-end:
    :D-start:
    :D-end:
  :B-end:
:A-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors.length).toBe(0);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst);
    expect(result.errors.length).toBe(0);
  });
});
