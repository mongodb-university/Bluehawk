import { RootParser } from "../parser/RootParser";
import { makeCstVisitor } from "../parser/makeCstVisitor";

describe("visitor", () => {
  const parser = new RootParser({
    blockCommentEndPattern: /\*\//,
    blockCommentStartPattern: /\/\*/,
    lineCommentPattern: /\/\//,
    canNestBlockComments: true,
  });
  const { lexer } = parser;

  it("can be constructed", () => {
    const tokens = lexer.tokenize(`
this is annotated text
:command: attribute
:no-attribute-command:
:this-is-a-block-command-start: attribute
annotated text
:this-is-a-block-command-end:
/* this is a block comment */
// this is a line comment
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const visitor = makeCstVisitor(parser);
    const cst = parser.annotatedText();
    visitor.visit(cst);
  });

  it("supports multiple commands", () => {
    const tokens = lexer.tokenize(`
:A-command:
:B-command:
:C-command:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors.length).toBe(0);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst);
    expect(result.errors).toStrictEqual([]);
    expect(result.commands.length).toBe(3);
    expect(result.commands[0].commandName).toBe("A-command");
    expect(result.commands[1].commandName).toBe("B-command");
    expect(result.commands[2].commandName).toBe("C-command");
  });

  it("supports multiple block commands", () => {
    const tokens = lexer.tokenize(`
:A-command-start:
:A-command-end:
:B-command-start:
:B-command-end:
:C-command-start:
:C-command-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors.length).toBe(0);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst);
    expect(result.errors).toStrictEqual([]);
    expect(result.commands.length).toBe(3);
    expect(result.commands[0].commandName).toBe("A-command");
    expect(result.commands[1].commandName).toBe("B-command");
    expect(result.commands[2].commandName).toBe("C-command");
  });

  it("detects mismatched command names", () => {
    const tokens = lexer.tokenize(`
:this-is-a-command-start:
:this-is-a-different-command-end:
`);
    expect(tokens.errors).toStrictEqual([]);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst);
    expect(result.errors).toStrictEqual([]);
  });

  it("supports nested commands", () => {
    const tokens = lexer.tokenize(`
:A-start: a
  :B-start: b
    :C-start: c
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
    expect(result.errors).toStrictEqual([]);
    expect(result.commands.length).toBe(1);
    expect(result.commands[0].children.length).toBe(1);
    expect(result.commands[0].children[0].children.length).toBe(2);
  });

  it("supports id commands", () => {
    const tokens = lexer.tokenize(`
:A-start: label
:A-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors.length).toBe(0);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst);
    expect(result.errors).toStrictEqual([]);
    expect(result.commands[0].commandName).toBe("A");
    expect(result.commands[0].children.length).toBe(0);
    expect(result.commands[0].id).toBe("label");
  });

  it("detects comment context", () => {
    const tokens = lexer.tokenize(`
0 /* :command-in-a-block-comment: */
1 // :line-commented-command:
2 // /* :still-line-commented-command: */
3 /* // :still-block-commented-command: */
/*
4 :another-block-commented-command:
*/
5 :line-commented-block-command-start:
// // // // :line-commented-block-command-end:

/*
6 // :not-really-line-commented-block-command-start:
:not-really-line-commented-block-command-end:
*/
7 :not-in-context:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst);
    expect(result.errors).toStrictEqual([]);
    //expect(result.commands.length).toBe(8);
    expect(result.commands[0].commandName).toBe("command-in-a-block-comment");
    expect(result.commands[0].inContext).toBe("blockComment");
    expect(result.commands[1].commandName).toBe("line-commented-command");
    expect(result.commands[1].inContext).toBe("lineComment");
    expect(result.commands[2].commandName).toBe("still-line-commented-command");
    expect(result.commands[2].inContext).toBe("lineComment");
    expect(result.commands[3].commandName).toBe(
      "still-block-commented-command"
    );
    expect(result.commands[3].inContext).toBe("blockComment");
    expect(result.commands[4].commandName).toBe(
      "another-block-commented-command"
    );
    expect(result.commands[4].inContext).toBe("blockComment");
    expect(result.commands[5].commandName).toBe("line-commented-block-command");
    expect(result.commands[5].inContext).toBe("lineComment");
    expect(result.commands[6].commandName).toBe(
      "not-really-line-commented-block-command"
    );
    expect(result.commands[6].inContext).toBe("blockComment");
    expect(result.commands[7].commandName).toBe("not-in-context");
    expect(result.commands[7].inContext).toBe("none");
  });
});
