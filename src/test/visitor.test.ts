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
    expect(result.errors[0].message).toBe(
      "Unexpected this-is-a-different-command-end closing this-is-a-command-start"
    );
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

  it("detects comment context on line commands", () => {
    const tokens = lexer.tokenize(`
0 /* :command-in-a-block-comment: */
1 // :line-commented-command:
2 // /* :still-line-commented-command: */
3 /* // :still-block-commented-command: */
/*
4 :another-block-commented-command:
*/
5 :not-in-context:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst);
    expect(result.errors).toStrictEqual([]);
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
    expect(result.commands[5].commandName).toBe("not-in-context");
    expect(result.commands[5].inContext).toBe("none");
  });

  it("detects comment context on block commands", () => {
    const tokens = lexer.tokenize(`// :line-commented-block-command-start:
// // // // :line-commented-block-command-end: */

/*
2 // :not-really-line-commented-block-command-start:
:not-really-line-commented-block-command-end:
*/

:not-in-context-start:
:not-in-context-end:

// :lcb-start:
:lcb-end: //// Not closing on a line comment doesn't matter
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst);
    expect(result.errors).toStrictEqual([]);
    expect(result.commands[0].commandName).toBe("line-commented-block-command");
    expect(result.commands[0].inContext).toBe("lineComment");
    expect(result.commands[1].commandName).toBe(
      "not-really-line-commented-block-command"
    );
    expect(result.commands[1].inContext).toBe("blockComment");
    expect(result.commands[2].commandName).toBe("not-in-context");
    expect(result.commands[2].inContext).toBe("none");
    expect(result.commands[3].commandName).toBe("lcb");
    expect(result.commands[3].inContext).toBe("lineComment");
  });

  it("never puts lineComment context on a top-level command that starts on another line", () => {
    const tokens = lexer.tokenize(`//
////
/* */ hiya :not-sure-how-to-test-this: // comment
////
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst);
    expect(result.errors).toStrictEqual([]);
    expect(result.commands[0].commandName).toBe("not-sure-how-to-test-this");
    expect(result.commands[0].inContext).toBe("none");
  });

  test("descendants inherit context", () => {
    const tokens = lexer.tokenize(`
// :a-start:
  :b-start: 
    /* :c-start:
      :d-start:
      :d-end:
    :c-end: */
    -- end block comment --
    :e-start:
    :e-end:
  :b-end:
:a-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst);
    expect(result.errors).toStrictEqual([]);
    const a = result.commands[0];
    expect(a.commandName).toBe("a");
    expect(a.inContext).toBe("lineComment");
    const b = a.children[0];
    expect(b.commandName).toBe("b");
    expect(b.inContext).toBe("lineComment");
    const c = b.children[0];
    expect(c.commandName).toBe("c");
    expect(c.inContext).toBe("blockComment");
    const d = c.children[0];
    expect(d.commandName).toBe("d");
    expect(d.inContext).toBe("blockComment");
    const e = b.children[1];
    expect(e.commandName).toBe("e");
    expect(e.inContext).toBe("lineComment");
  });

  test("identifies start and end lines for block commands", () => {
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
    const result = visitor.visit(cst);
    expect(result.errors).toStrictEqual([]);
    expect(result.commands.length).toBe(1);
    const a = result.commands[0];
    expect(a.commandName).toBe("a");
    // range describes the total block range, from the start of the first command
    // to the end of the last command
    expect(result.commands[0].range.start.line).toBe(2);
    expect(result.commands[0].range.start.column).toBe(4);
    expect(result.commands[0].range.start.offset).toBe(4);
    expect(result.commands[0].range.end.line).toBe(4);
    expect(result.commands[0].range.end.column).toBe(10);
    expect(result.commands[0].range.end.offset).toBe(50);
  });

  test("identifies start and end lines for block command content", () => {
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
    const result = visitor.visit(cst);
    expect(result.errors).toStrictEqual([]);
    expect(result.commands.length).toBe(1);
    const a = result.commands[0];
    expect(a.commandName).toBe("a");
    // contentRange describes the range of the block's content, including sub-commands
    // but not the current start/endcommands
    expect(result.commands[0].contentRange.start.line).toBe(3);
    expect(result.commands[0].contentRange.start.column).toBe(0);
    expect(result.commands[0].contentRange.start.offset).toBe(14);
    expect(result.commands[0].contentRange.end.line).toBe(3);
    expect(result.commands[0].contentRange.end.column).toBe(27);
    expect(result.commands[0].contentRange.end.offset).toBe(43);
  });


  test("identifies start and end lines for nested block commands", () => {
    const tokens = lexer.tokenize(`
// :a-start:
the quick brown fox jumped
// :b-start:
he jumped again
// :c-start:
and again
// :c-end:
// :b-end:
// :a-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst);
    expect(result.errors).toStrictEqual([]);
    expect(result.commands.length).toBe(1);

    const a = result.commands[0];
    expect(a.commandName).toBe("a");
    // range describes the total block range, from the start of the first command
    // to the end of the last command
    expect(a.range.start.line).toBe(2);
    expect(a.range.start.column).toBe(4);
    expect(a.range.start.offset).toBe(4);
    expect(a.range.end.line).toBe(10);
    expect(a.range.end.column).toBe(10);
    expect(a.range.end.offset).toBe(124);
    // contentRange describes the range of the block's content, including sub-commands
    // but not the current start/endcommands
    expect(a.contentRange.start.line).toBe(3);
    expect(a.contentRange.start.column).toBe(0);
    expect(a.contentRange.start.offset).toBe(14);
    expect(a.contentRange.end.line).toBe(9);
    expect(a.contentRange.end.column).toBe(11);
    expect(a.contentRange.end.offset).toBe(117);

    const b = result.commands[0].children[0]
    expect(b.commandName).toBe("b")
    // range describes the total block range, from the start of the first command
    // to the end of the last command
    expect(b.range.start.line).toBe(4);
    expect(b.range.start.column).toBe(4);
    expect(b.range.start.offset).toBe(44);
    expect(b.range.end.line).toBe(9);
    expect(b.range.end.column).toBe(10);
    expect(b.range.end.offset).toBe(113);
    // contentRange describes the range of the block's content, including sub-commands
    // but not the current start/endcommands
    expect(b.contentRange.start.line).toBe(5);
    expect(b.contentRange.start.column).toBe(0);
    expect(b.contentRange.start.offset).toBe(54);
    expect(b.contentRange.end.line).toBe(8);
    expect(b.contentRange.end.column).toBe(11);
    expect(b.contentRange.end.offset).toBe(106);

    const c = result.commands[0].children[0].children[0]
    expect(c.commandName).toBe("c")
    // range describes the total block range, from the start of the first command
    // to the end of the last command
    expect(c.range.start.line).toBe(6);
    expect(c.range.start.column).toBe(4);
    expect(c.range.start.offset).toBe(73);
    expect(c.range.end.line).toBe(8);
    expect(c.range.end.column).toBe(10);
    expect(c.range.end.offset).toBe(102);
    // contentRange describes the range of the block's content, including sub-commands
    // but not the current start/endcommands
    expect(c.contentRange.start.line).toBe(7);
    expect(c.contentRange.start.column).toBe(0);
    expect(c.contentRange.start.offset).toBe(83);
    expect(c.contentRange.end.line).toBe(7);
    expect(c.contentRange.end.column).toBe(10);
    expect(c.contentRange.end.offset).toBe(95);
  });

  test("identifies start and end lines for one-liner commands", () => {
    const tokens = lexer.tokenize(`
// :A-command:
// :B-command:
// :C-command:
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
    expect(result.commands[0].range.start.line).toBe(2)
    expect(result.commands[0].range.start.column).toBe(4)
    expect(result.commands[0].range.start.offset).toBe(4)
    expect(result.commands[1].commandName).toBe("B-command");
    expect(result.commands[1].range.start.line).toBe(3)
    expect(result.commands[1].range.start.column).toBe(4)
    expect(result.commands[1].range.start.offset).toBe(19)
    expect(result.commands[2].commandName).toBe("C-command");
    expect(result.commands[2].range.start.line).toBe(4)
    expect(result.commands[2].range.start.column).toBe(4)
    expect(result.commands[2].range.start.offset).toBe(34)
  });
});
