import { RootParser } from "../RootParser";
import { makeCstVisitor } from "../visitor/makeCstVisitor";
import { makeBlockCommentTokens } from "../lexer/makeBlockCommentTokens";
import { makeLineCommentToken } from "../lexer/makeLineCommentToken";
import { Document } from "../../Document";

describe("visitor", () => {
  const parser = new RootParser([
    ...makeBlockCommentTokens(/\/\*/y, /\*\//y),
    makeLineCommentToken(/\/\//),
  ]);
  const { lexer } = parser;
  const source = new Document({
    text: "mock",
    path: "mock",
  });

  it("can be constructed", () => {
    const tokens = lexer.tokenize(`
this is annotated text
:tag: attribute
:no-attribute-tag:
:this-is-a-block-tag-start: attribute
annotated text
:this-is-a-block-tag-end:
/* this is a block comment */
// this is a line comment
`);
    expect(tokens.errors).toStrictEqual([]);
    parser.input = tokens.tokens;
    const visitor = makeCstVisitor(parser);
    const cst = parser.annotatedText();
    visitor.visit(cst, source);
  });

  it("supports multiple tags", () => {
    const tokens = lexer.tokenize(`
:A-tag:
:B-tag:
:C-tag:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors.length).toBe(0);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
    expect(result.tagNodes.length).toBe(3);
    expect(result.tagNodes[0].tagName).toBe("A-tag");
    expect(result.tagNodes[1].tagName).toBe("B-tag");
    expect(result.tagNodes[2].tagName).toBe("C-tag");
  });

  it("supports multiple block tags", () => {
    const tokens = lexer.tokenize(`
:A-tag-start:
:A-tag-end:
:B-tag-start:
:B-tag-end:
:C-tag-start:
:C-tag-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors.length).toBe(0);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
    expect(result.tagNodes.length).toBe(3);
    expect(result.tagNodes[0].tagName).toBe("A-tag");
    expect(result.tagNodes[1].tagName).toBe("B-tag");
    expect(result.tagNodes[2].tagName).toBe("C-tag");
  });

  it("detects mismatched non-nested tag names", () => {
    const tokens = lexer.tokenize(`
:this-is-a-tag-start:
:this-is-a-different-tag-end:
`);
    expect(tokens.errors).toStrictEqual([]);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors[0].message).toBe(
      "Unexpected this-is-a-different-tag-end closing this-is-a-tag-start"
    );
    expect(result.tagNodes.length).toBe(0);
  });

  it("supports nested tags", () => {
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
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
    expect(result.tagNodes.length).toBe(1);
    expect((result.tagNodes[0].children ?? []).length).toBe(1);
    expect((result.tagNodes[0].children ?? [])[0].children?.length ?? 0).toBe(
      2
    );
  });

  it("supports id tags", () => {
    const tokens = lexer.tokenize(`
:A-start: label
:A-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors.length).toBe(0);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
    expect(result.tagNodes[0].tagName).toBe("A");
    expect((result.tagNodes[0].children ?? []).length).toBe(0);
    expect(
      result.tagNodes[0].shorthandArgs !== undefined &&
        result.tagNodes[0].shorthandArgs.length == 1 &&
        result.tagNodes[0].shorthandArgs[0]
    ).toBe("label");
  });

  it("detects comment context on line tags", () => {
    const tokens = lexer.tokenize(`
0 /* :tag-in-a-block-comment: */
1 // :line-commented-tag:
2 // /* :still-line-commented-tag: */
3 /* // :still-block-commented-tag: */
/*
4 :another-block-commented-tag:
*/
5 :not-in-context:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
    expect(result.tagNodes[0].tagName).toBe("tag-in-a-block-comment");
    expect(result.tagNodes[0].inContext).toBe("blockComment");
    expect(result.tagNodes[1].tagName).toBe("line-commented-tag");
    expect(result.tagNodes[1].inContext).toBe("lineComment");
    expect(result.tagNodes[2].tagName).toBe("still-line-commented-tag");
    expect(result.tagNodes[2].inContext).toBe("lineComment");
    expect(result.tagNodes[3].tagName).toBe("still-block-commented-tag");
    expect(result.tagNodes[3].inContext).toBe("blockComment");
    expect(result.tagNodes[4].tagName).toBe("another-block-commented-tag");
    expect(result.tagNodes[4].inContext).toBe("blockComment");
    expect(result.tagNodes[5].tagName).toBe("not-in-context");
    expect(result.tagNodes[5].inContext).toBe("none");
  });

  it("detects comment context on block tags", () => {
    const tokens = lexer.tokenize(`// :line-commented-block-tag-start:
// // // // :line-commented-block-tag-end: */

/*
2 // :not-really-line-commented-block-tag-start:
:not-really-line-commented-block-tag-end:
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
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
    expect(result.tagNodes[0].tagName).toBe("line-commented-block-tag");
    expect(result.tagNodes[0].inContext).toBe("lineComment");
    expect(result.tagNodes[1].tagName).toBe(
      "not-really-line-commented-block-tag"
    );
    expect(result.tagNodes[1].inContext).toBe("blockComment");
    expect(result.tagNodes[2].tagName).toBe("not-in-context");
    expect(result.tagNodes[2].inContext).toBe("none");
    expect(result.tagNodes[3].tagName).toBe("lcb");
    expect(result.tagNodes[3].inContext).toBe("lineComment");
  });

  it("never puts lineComment context on a top-level tag that starts on another line", () => {
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
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
    expect(result.tagNodes[0].tagName).toBe("not-sure-how-to-test-this");
    expect(result.tagNodes[0].inContext).toBe("none");
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
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
    const a = result.tagNodes[0];
    expect(a.tagName).toBe("a");
    expect(a.inContext).toBe("lineComment");
    expect(a.children).toBeDefined();
    if (a.children === undefined) {
      return;
    }
    const b = a.children[0];
    expect(b.tagName).toBe("b");
    expect(b.inContext).toBe("lineComment");
    expect(b.children).toBeDefined();
    if (b.children === undefined) {
      return;
    }
    const c = b.children[0];
    expect(c.tagName).toBe("c");
    expect(c.inContext).toBe("blockComment");
    expect(c.children).toBeDefined();
    if (c.children === undefined) {
      return;
    }
    const d = c.children[0];
    expect(d.tagName).toBe("d");
    expect(d.inContext).toBe("blockComment");
    const e = b.children[1];
    expect(e.tagName).toBe("e");
    expect(e.inContext).toBe("lineComment");
  });

  test("identifies start and end lines for block tags", () => {
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
    expect(result.errors).toStrictEqual([]);
    expect(result.tagNodes.length).toBe(1);
    const a = result.tagNodes[0];
    expect(a.tagName).toBe("a");
    // range describes the total block range, from the start of the first tag
    // to the end of the last tag
    expect(result.tagNodes[0].range.start.line).toBe(2);
    expect(result.tagNodes[0].range.start.column).toBe(4);
    expect(result.tagNodes[0].range.start.offset).toBe(4);
    expect(result.tagNodes[0].range.end.line).toBe(4);
    expect(result.tagNodes[0].range.end.column).toBe(10);
    expect(result.tagNodes[0].range.end.offset).toBe(50);
  });

  test("identifies start and end lines for block tag content", () => {
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
    expect(result.errors).toStrictEqual([]);
    expect(result.tagNodes.length).toBe(1);
    const a = result.tagNodes[0];
    expect(a.tagName).toBe("a");
    // contentRange describes the range of the block's content, including sub-tags
    // but not the current start/endtags
    expect(result.tagNodes[0].contentRange).toBeDefined();
    if (result.tagNodes[0].contentRange === undefined) {
      return;
    }
    expect(result.tagNodes[0].contentRange.start.line).toBe(3);
    expect(result.tagNodes[0].contentRange.start.column).toBe(1);
    expect(result.tagNodes[0].contentRange.start.offset).toBe(14);
    expect(result.tagNodes[0].contentRange.end.line).toBe(4);
    expect(result.tagNodes[0].contentRange.end.column).toBe(1);
    //expect(result.tags[0].contentRange.end.offset).toBe(43);
  });

  test("identifies start and end lines for nested block tags", () => {
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
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
    expect(result.tagNodes.length).toBe(1);

    const a = result.tagNodes[0];
    expect(a.tagName).toBe("a");
    // range describes the total block range, from the start of the first tag
    // to the end of the last tag
    expect(a.range.start.line).toBe(2);
    expect(a.range.start.column).toBe(4);
    expect(a.range.start.offset).toBe(4);
    expect(a.range.end.line).toBe(10);
    expect(a.range.end.column).toBe(10);
    expect(a.range.end.offset).toBe(124);
    // contentRange describes the range of the block's content, including sub-tags
    // but not the current start/endtags
    expect(a.contentRange).toBeDefined();
    if (a.contentRange === undefined) {
      return;
    }
    expect(a.contentRange.start.line).toBe(3);
    expect(a.contentRange.start.column).toBe(1);
    expect(a.contentRange.start.offset).toBe(14);
    expect(a.contentRange.end.line).toBe(10);
    expect(a.contentRange.end.column).toBe(1);
    expect(a.contentRange.end.offset).toBe(115);

    const b = (result.tagNodes[0].children ?? [])[0];
    expect(b.tagName).toBe("b");
    // range describes the total block range, from the start of the first tag
    // to the end of the last tag
    expect(b.range.start.line).toBe(4);
    expect(b.range.start.column).toBe(4);
    expect(b.range.start.offset).toBe(44);
    expect(b.range.end.line).toBe(9);
    expect(b.range.end.column).toBe(10);
    expect(b.range.end.offset).toBe(113);
    // contentRange describes the range of the block's content, including sub-tags
    // but not the current start/endtags
    expect(b.contentRange).toBeDefined();
    if (b.contentRange === undefined) {
      return;
    }
    expect(b.contentRange.start.line).toBe(5);
    expect(b.contentRange.start.column).toBe(1);
    expect(b.contentRange.start.offset).toBe(54);
    expect(b.contentRange.end.line).toBe(9);
    expect(b.contentRange.end.column).toBe(1);
    expect(b.contentRange.end.offset).toBe(104);

    const c = ((result.tagNodes[0].children ?? [])[0].children ?? [])[0];
    expect(c.tagName).toBe("c");
    // range describes the total block range, from the start of the first tag
    // to the end of the last tag
    expect(c.range.start.line).toBe(6);
    expect(c.range.start.column).toBe(4);
    expect(c.range.start.offset).toBe(73);
    expect(c.range.end.line).toBe(8);
    expect(c.range.end.column).toBe(10);
    expect(c.range.end.offset).toBe(102);
    // contentRange describes the range of the block's content, including sub-tags
    // but not the current start/endtags
    expect(c.contentRange).toBeDefined();
    if (c.contentRange === undefined) {
      return;
    }
    expect(c.contentRange.start.line).toBe(7);
    expect(c.contentRange.start.column).toBe(1);
    expect(c.contentRange.start.offset).toBe(83);
    expect(c.contentRange.end.line).toBe(8);
    expect(c.contentRange.end.column).toBe(1);
    expect(c.contentRange.end.offset).toBe(93);
  });

  test("lines and columns are 1-based index while offsets are 0-based", () => {
    const tokens = lexer.tokenize(`:A-tag:
 :B-tag:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
    expect(result.tagNodes[0].tagName).toBe("A-tag");
    expect(result.tagNodes[0].range.start.line).toBe(1);
    expect(result.tagNodes[0].range.start.column).toBe(1);
    expect(result.tagNodes[0].range.start.offset).toBe(0);
    expect(result.tagNodes[0].range.end.line).toBe(1);
    expect(result.tagNodes[0].range.end.column).toBe(7);
    expect(result.tagNodes[1].tagName).toBe("B-tag");
    expect(result.tagNodes[1].range.start.line).toBe(2);
    expect(result.tagNodes[1].range.start.column).toBe(2);
    expect(result.tagNodes[1].range.start.offset).toBe(9);
    expect(result.tagNodes[1].range.end.line).toBe(2);
    expect(result.tagNodes[1].range.end.column).toBe(8);
  });

  test("identifies start and end lines for one-liner tags", () => {
    const tokens = lexer.tokenize(`
// :A-tag:
// :B-tag:
// :C-tag:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors.length).toBe(0);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
    expect(result.tagNodes.length).toBe(3);
    expect(result.tagNodes[0].tagName).toBe("A-tag");
    expect(result.tagNodes[0].range.start.line).toBe(2);
    expect(result.tagNodes[0].range.start.column).toBe(4);
    expect(result.tagNodes[0].range.start.offset).toBe(4);
    expect(result.tagNodes[1].tagName).toBe("B-tag");
    expect(result.tagNodes[1].range.start.line).toBe(3);
    expect(result.tagNodes[1].range.start.column).toBe(4);
    expect(result.tagNodes[1].range.start.offset).toBe(15);
    expect(result.tagNodes[2].tagName).toBe("C-tag");
    expect(result.tagNodes[2].range.start.line).toBe(4);
    expect(result.tagNodes[2].range.start.column).toBe(4);
    expect(result.tagNodes[2].range.start.offset).toBe(26);
  });

  it("identifies ranges for many one-liners on the same commented line", () => {
    const tokens = lexer.tokenize(`// :A-tag: :B-tag: :C-tag:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors.length).toBe(0);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
    expect(result.tagNodes.length).toBe(3);
    expect(result.tagNodes[0].tagName).toBe("A-tag");
    expect(result.tagNodes[0].range).toStrictEqual({
      start: {
        line: 1,
        column: 4,
        offset: 3,
      },
      end: {
        line: 1,
        column: 11,
        offset: 10,
      },
    });
    expect(result.tagNodes[1].tagName).toBe("B-tag");
    expect(result.tagNodes[1].range).toStrictEqual({
      start: {
        line: 1,
        column: 12,
        offset: 11,
      },
      end: {
        line: 1,
        column: 19,
        offset: 18,
      },
    });
    expect(result.tagNodes[2].tagName).toBe("C-tag");
    expect(result.tagNodes[2].range).toStrictEqual({
      start: {
        line: 1,
        column: 20,
        offset: 19,
      },
      end: {
        line: 1,
        column: 26,
        offset: 25,
      },
    });
  });

  it("identifies range for empty block tag content", () => {
    const tokens = lexer.tokenize(`:a-start:
:a-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
    expect(result.tagNodes.length).toBe(1);
    expect(result.tagNodes[0].contentRange).toBeUndefined();
  });

  it("identifies content range for block tags with attributeLists", () => {
    const tokenString = `:a-start: {






        }
line 9 -- some more content
line 10 :a-end:
`;
    const tokens = lexer.tokenize(tokenString);
    expect(tokens.errors).toStrictEqual([]);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
    expect(result.tagNodes.length).toBe(1);
    const lines = tokenString.split("\n");
    expect(result.tagNodes[0].contentRange).toBeDefined();
    if (result.tagNodes[0].contentRange === undefined) {
      return;
    }
    expect(result.tagNodes[0].contentRange.start.line).toBe(9);
    expect(lines[result.tagNodes[0].contentRange.start.line - 1]).toBe(
      "line 9 -- some more content"
    );
    expect(result.tagNodes[0].contentRange.start.column).toBe(1);
    expect(result.tagNodes[0].contentRange.start.offset).toBe(28);
    expect(result.tagNodes[0].contentRange.end.line).toBe(10);
    expect(result.tagNodes[0].contentRange.end.column).toBe(1);
    expect(result.tagNodes[0].contentRange.end.offset).toBe(56);

    // Remember lines are 1-based while the lines array starts at index 0
    expect(lines[result.tagNodes[0].contentRange.end.line - 1]).toBe(
      "line 10 :a-end:"
    );
  });

  it("contains potentially useful tokens", () => {
    const tokenString = `:a-start: {
}
// comments included
:b-start:
// nest
:b-end:
:a-end:
`;
    const tokens = lexer.tokenize(tokenString);
    expect(tokens.errors).toStrictEqual([]);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
    expect(
      result.tagNodes[0].lineComments.map((token) => token.startLine)
    ).toStrictEqual([3]);
    expect(
      (result.tagNodes[0].children ?? [])[0].lineComments.map(
        (token) => token.startLine
      )
    ).toStrictEqual([5]);
  });
  test("offset matches line + column", () => {
    const tokenString = `a2345678
b2345678
c2345678 :a-start:
//
// :a-end:
`;
    const tokens = lexer.tokenize(tokenString);
    expect(tokens.errors).toStrictEqual([]);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
    expect(result.tagNodes.length).toBe(1);
    // Re-add newlines since they are included in the offset
    const lines = tokenString.split("\n").map((line) => `${line}\n`);
    expect(lines[0].length).toBe(9);
    expect(lines[1].length).toBe(9);
    expect(lines[2].length).toBe(19);
    expect(lines[3].length).toBe(3);
    expect(lines[4].length).toBe(11);
    expect(result.tagNodes[0].contentRange).toBeDefined();
    if (result.tagNodes[0].contentRange === undefined) {
      return;
    }
    expect(result.tagNodes[0].contentRange.start.line).toBe(4);
    expect(result.tagNodes[0].contentRange.start.column).toBe(1);

    expect(result.tagNodes[0].contentRange.start.offset).toBe(
      lines[0].length + lines[1].length + lines[2].length
    );
    expect(result.tagNodes[0].contentRange.end.line).toBe(5);
    expect(result.tagNodes[0].contentRange.end.column).toBe(1);
    expect(result.tagNodes[0].contentRange.end.offset).toBe(
      lines[0].length + lines[1].length + lines[2].length + lines[3].length
    );
  });

  it("detects mismatched closing tags", () => {
    const input = `:a-start:
:b-start:
b-end: // TYPO!
:a-end:
`;
    const { errors } = parser.parse(input);
    expect(errors[0].message).toBe("Unexpected ':a-end:' closing ':b-start:'");
    expect(errors[1].message).toBe(
      "4:8(43) blockTag: After Newline, expected TagEnd but found EOF"
    );
    expect(errors.length).toBe(2);
  });
});
