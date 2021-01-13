import { RootParser } from "../parser/RootParser";
import { makeCstVisitor } from "../parser/makeCstVisitor";
import { makeBlockCommentTokens } from "../lexer/makeBlockCommentTokens";
import { makeLineCommentToken } from "../lexer/makeLineCommentToken";
import { BluehawkSource } from "../BluehawkSource";

describe("JSON attribute lists", () => {
  const parser = new RootParser([
    ...makeBlockCommentTokens(/\/\*/y, /\*\//y),
    makeLineCommentToken(/\/\//),
  ]);
  const { lexer } = parser;
  const source = new BluehawkSource({
    language: "mock",
    text: "mock",
    path: "mock",
  });

  it("accepts empty attribute lists", () => {
    const tokens = lexer.tokenize(`:A-command-start: {}
:A-command-end:
`);
    expect(tokens.errors).toStrictEqual([]);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
    expect(result.commands[0].commandName).toBe("A-command");
    expect(result.commands[0].attributes).toStrictEqual({});
  });

  it("attaches well-formed attribute lists to commands", () => {
    const tokens = lexer.tokenize(`:A-command-start: {
  "a": 1,
  "b": false,
  "c": true,
  "d": null,
  "e": [1, 2.0, 3e10, 3e-10, 3e+10, 3.14, -1.23],
  "f": {
    "g": [1, "\\"string\\"", {}]
  }
}
:A-command-end:
`);
    expect(tokens.errors.length).toBe(0);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors.length).toBe(0);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
    expect(result.commands[0].commandName).toBe("A-command");
    expect(result.commands[0].attributes).toStrictEqual({
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

    const tokens = lexer.tokenize(`:A-command-start: {
  "a": "\\n",


  1: 1
}
:A-command-end:
`);
    expect(tokens.errors).toStrictEqual([]);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors.length).toBe(0);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.commands[0].attributes).toBeUndefined();
    expect(result.errors[0].message).toBe("Unexpected number in JSON");
    expect(result.errors[0].location).toStrictEqual({
      line: 5,
      column: 3,
      offset: 37,
    });
  });

  it("reports malformed JSON in attribute lists", () => {
    const tokens = lexer.tokenize(`:A-command-start: {"a":

    [[[[[[[

}
:A-command-end:
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
      offset: 38,
    });
    expect(result.errors[0].message).toBe("Unexpected token } in JSON");
  });

  it("reports error accurately with weird newlines", () => {
    const tokens = lexer.tokenize(
      ":A-command-start: {\r\n" +
        "\r\n" +
        "\r\n" +
        "\r\n" +
        "[" + //
        "}\r\n :A-command-end:\r\n"
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
      offset: 27,
    });
    expect(result.errors[0].message).toBe("Unexpected token [ in JSON");
  });

  it("reports error accurately with mixed weird newlines", () => {
    const tokens = lexer.tokenize(
      ":A-command-start: {\r" +
        " \n" +
        "\r\n" +
        "\r" +
        "[" + //
        "}\r :A-command-end:\r"
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
      offset: 25,
    });
    expect(result.errors[0].message).toBe("Unexpected token [ in JSON");
  });

  it("allows line comments in JSON", () => {
    const tokens = lexer.tokenize(`// :A-command-start: {
// "a": 1,
// "b": 2,
// "c": 3
//}
// :A-command-end:
`);
    expect(tokens.errors).toStrictEqual([]);
    parser.input = tokens.tokens;
    const cst = parser.annotatedText();
    expect(parser.errors).toStrictEqual([]);
    const visitor = makeCstVisitor(parser);
    const result = visitor.visit(cst, source);
    expect(result.errors).toStrictEqual([]);
  });

  it("accurately reports error positions in commented JSON", () => {
    const tokens = lexer.tokenize(`// :A-command-start: {
// // "a": 1, //
// 7
}
:A-command-end:
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
      offset: 43,
    });
    expect(result.errors[0].message).toBe("Unexpected number in JSON");
  });
});
