import { RootParser } from "../RootParser";
import { makeCstVisitor } from "./makeCstVisitor";
import { makeBlockCommentTokens } from "../lexer/makeBlockCommentTokens";
import { makeLineCommentToken } from "../lexer/makeLineCommentToken";
import { Document } from "../../Document";

describe("JSON attribute lists", () => {
  const parser = new RootParser([
    ...makeBlockCommentTokens(/\/\*/y, /\*\//y),
    makeLineCommentToken(/\/\//),
  ]);
  const { lexer } = parser;
  const source = new Document({
    text: "mock",
    path: "mock",
  });

  it("accepts empty attribute lists", () => {
    const tokens = lexer.tokenize(`:A-tag-start: {}
:A-tag-end:
`);
    expect(tokens.errors).toStrictEqual([]);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
    expect(result.tagNodes[0].tagName).toBe("A-tag");
    expect(result.tagNodes[0].attributes).toStrictEqual({});
  });

  it("attaches well-formed attribute lists to tags", () => {
    const tokens = lexer.tokenize(`:A-tag-start: {
  "a": 1,
  "b": false,
  "c": true,
  "d": null,
  "e": [1, 2.0, 3e10, 3e-10, 3e+10, 3.14, -1.23],
  "f": {
    "g": [1, "\\"string\\"", {}]
  }
}
:A-tag-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors.length).toBe(0);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
    expect(result.tagNodes[0].tagName).toBe("A-tag");
    expect(result.tagNodes[0].attributes).toStrictEqual({
      a: 1,
      b: false,
      c: true,
      d: null,
      e: [1, 2.0, 3e10, 3e-10, 3e10, 3.14, -1.23],
      f: {
        g: [1, '"string"', {}],
      },
    });
  });

  it("reports unexpected tokens in attribute lists", () => {
    // An escaped newline should not throw off the error report location.
    // Let's be sure our assumption about how to escape newlines is correct:
    expect(JSON.parse(`"\\n"`)).toBe("\n");

    const tokens = lexer.tokenize(`:A-tag-start: {
  "a": "\\n",


  1: 1
}
:A-tag-end:
`);
    expect(tokens.errors).toStrictEqual([]);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors.length).toBe(0);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.tagNodes[0].attributes).toBeUndefined();
    expect(result.errors[0].message).toBe("Unexpected number in JSON");
    expect(result.errors[0].location).toStrictEqual({
      line: 5,
      column: 3,
      offset: 33,
    });
  });

  it("reports malformed JSON in attribute lists", () => {
    const tokens = lexer.tokenize(`:A-tag-start: {"a":

    [[[[[[[

}
:A-tag-end:
`);
    expect(tokens.errors).toStrictEqual([]);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors.length).toBe(0);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors[0].location).toStrictEqual({
      line: 5,
      column: 1,
      offset: 34,
    });
    expect(result.errors[0].message).toBe("Unexpected token } in JSON");
  });

  it("reports error accurately with weird newlines", () => {
    const tokens = lexer.tokenize(
      ":A-tag-start: {\r\n" +
        "\r\n" +
        "\r\n" +
        "\r\n" +
        "[" + //
        "}\r\n :A-tag-end:\r\n"
    );
    expect(tokens.errors).toStrictEqual([]);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors[0].location).toStrictEqual({
      line: 5,
      column: 1,
      offset: 23,
    });
    expect(result.errors[0].message).toBe("Unexpected token [ in JSON");
  });

  it("reports error accurately with mixed weird newlines", () => {
    const tokens = lexer.tokenize(
      ":A-tag-start: {\r" +
        " \n" +
        "\r\n" +
        "\r" +
        "[" + //
        "}\r :A-tag-end:\r"
    );
    expect(tokens.errors).toStrictEqual([]);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors[0].location).toStrictEqual({
      line: 5,
      column: 1,
      offset: 21,
    });
    expect(result.errors[0].message).toBe("Unexpected token [ in JSON");
  });

  it("allows line comments in JSON", () => {
    const tokens = lexer.tokenize(`// :A-tag-start: {
// "a": 1,
// "b": 2,
// "c": 3,
// "d": // { 
//   "a": 1
// }
//}
// :A-tag-end:
`);
    expect(tokens.errors).toStrictEqual([]);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
    expect(result.tagNodes[0].attributes).toStrictEqual({
      a: 1,
      b: 2,
      c: 3,
      d: { a: 1 },
    });
  });

  it("does not strip line comments in strings", () => {
    const tokens = lexer.tokenize(`// :A-tag-start: {
// "a": "//",
// "b": { // "c": "// //" }
//}
// :A-tag-end:
`);
    expect(tokens.errors).toStrictEqual([]);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
    expect(result.tagNodes[0].attributes).toStrictEqual({
      a: "//",
      b: { c: "// //" },
    });
  });

  it("accurately reports error positions in commented JSON", () => {
    const tokens = lexer.tokenize(`// :A-tag-start: {
// // "a": 1, //
// 7
}
:A-tag-end:
`);
    expect(tokens.errors).toStrictEqual([]);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors[0].location).toStrictEqual({
      line: 3,
      column: 4,
      offset: 39,
    });
    expect(result.errors[0].message).toBe("Unexpected number in JSON");
  });
});
