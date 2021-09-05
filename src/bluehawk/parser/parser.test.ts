import { makeBlockCommentTokens } from "./lexer/makeBlockCommentTokens";
import { makeLineCommentToken } from "./lexer/makeLineCommentToken";
import { RootParser } from "../parser/RootParser";

describe("parser", () => {
  const parser = new RootParser([
    ...makeBlockCommentTokens(/\/\*/y, /\*\//y),
    makeLineCommentToken(/\/\//y),
  ]);
  const { lexer } = parser;

  describe("chunk rule", () => {
    it("accepts no more than one newline at top level", () => {
      const result = lexer.tokenize(`some text
bad second line
`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.chunk();
      expect(parser.errors.map((error) => error.message)).toStrictEqual([
        "2:16(25) undefined: expecting EOF but found Newline",
      ]);
    });

    it("ends with a Newline", () => {
      const result = lexer.tokenize(`//
`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.chunk();
      expect(parser.errors).toStrictEqual([]);
    });

    it("could end with a CommandEnd", () => {
      const result = lexer.tokenize(`// :command-end:`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.chunk();
      expect(parser.errors.map((error) => error.message)).toStrictEqual([
        "1:4(3) undefined: expecting EOF but found CommandEnd",
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

    it("accepts line commands", () => {
      const result = lexer.tokenize(`:some-command:`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.command();
      expect(parser.errors).toStrictEqual([]);
    });

    it("rejects anything else", () => {
      const otherTokens = ["//", "/*", "*/", "\n", ":some-command-end:"];
      otherTokens.forEach((token) => {
        const result = lexer.tokenize(token);
        expect(result.errors.length).toBe(0);
        parser.input = result.tokens;
        parser.command();
        expect(parser.errors[0].message).toBe(
          "NaN:NaN(NaN) command: expecting one of these possible token sequences: CommandStart | Command "
        );
      });
    });
  });

  describe("blockCommand rule", () => {
    it("must not start with a line comment", () => {
      const result = lexer.tokenize(`// :block-command-start:
:block-command-end:`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.blockCommand();
      // This is not a top-level rule anybody would use directly outside of a
      // unit test so the NaN in the error message is less concerning
      expect(parser.errors[0].message).toBe(
        "NaN:NaN(NaN) blockCommand: After EOF, expected CommandStart but found LineComment"
      );
    });

    it("handles optional identifiers", () => {
      const result = lexer.tokenize(`:block-command-start: identifier
:block-command-end:`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.blockCommand();
      expect(parser.errors).toStrictEqual([]);
    });

    it("handles empty attribute lists", () => {
      const result = lexer.tokenize(`:block-command-start: {
}
:block-command-end:`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.blockCommand();
      expect(parser.errors).toStrictEqual([]);
    });

    it("handles attribute lists with json", () => {
      const json = `{"a": 1,
  "b": false,
  "c": true,
  "d": null,
  "e": [1, 2.0, 3e10, 3e-10, 3e+10, 3.14, -1.23],
  "f": {
    "g": [1, "\\"string\\"", {}]
  }
}`;
      expect(JSON.parse(json)).toBeDefined(); // It is valid JSON
      const result = lexer.tokenize(`:block-command-start: ${json}
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
      const cst = parser.blockCommand();
      expect(parser.errors).toStrictEqual([]);
      expect(Object.keys(cst.children)).toStrictEqual([
        "CommandStart",
        "commandAttribute",
        "Newline",
        "chunk",
        "CommandEnd",
      ]);
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

  describe("lineComment rule", () => {
    it("accepts block commands", () => {
      const result = lexer.tokenize(`// :command-start:
:command-end:`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.lineComment();
      expect(parser.errors.length).toBe(0);
    });

    it("accepts line commands", () => {
      const result = lexer.tokenize(`// :command:`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.lineComment();
      expect(parser.errors.length).toBe(0);
    });

    it("allows block comment tokens", () => {
      const result = lexer.tokenize(
        `// */ */ unexpected tokens?! /* no, because they would be commented out /*`
      );
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.lineComment();
      expect(parser.errors.length).toBe(0);
    });
  });

  describe("attributeList rule", () => {
    it("accepts valid json", () => {
      const json = `{"a": 1,
  "b": false,
  "c": true,
  "d": null,
  "e": [1, 2.0, 3e10, 3e-10, 3e+10, 3.14, -1.23],
  "f": {
    "g": [1, "\\"string\\"", {}]
  }
}`;
      expect(JSON.parse(json)).toBeDefined(); // It is valid JSON
      const result = lexer.tokenize(`:block-command-start: ${json}`);
      expect(result.errors.length).toBe(0);
      expect(result.tokens[0].image).toBe(":block-command-start:");
      expect(result.tokens[1].image).toBe("{");
      parser.input = result.tokens.slice(1); // CommandStart required to get lexer in JSON mode
      expect(parser.attributeList).toBeDefined();
      parser.attributeList();
      expect(parser.errors).toStrictEqual([]);
    });

    it("accepts somewhat invalid json", () => {
      // The parser only consumes the tokens and does not care about the syntax
      // of JSON. We are deferring to JSON.parse() to do that. All that really
      // matters is the curly braces match.
      const json = `{1: 1,
  false: false,
  {}: true,
  []: null,
  [,,,]: [1, 2.0, 3e10, 3e-10, 3e+10, 3.14, -1.23]
  "nocomma"
  "nocolon" {
    "g"] [1, "\\"string\\"", {}]
  }
}`;
      expect(() => {
        JSON.parse(json);
      }).toThrow("Unexpected number in JSON at position 1"); // It is not valid JSON
      const result = lexer.tokenize(`:block-command-start: ${json}`);
      expect(result.errors.length).toBe(0);
      expect(result.tokens[0].image).toBe(":block-command-start:");
      expect(result.tokens[1].image).toBe("{");
      parser.input = result.tokens.slice(1); // CommandStart required to get lexer in JSON mode
      parser.attributeList();
      expect(parser.errors).toStrictEqual([]); // JSON invalid, but it is still ok
    });

    it("accepts commented json", () => {
      // The parser only consumes the tokens and does not care about the syntax
      // of JSON. We are deferring to JSON.parse() to do that. All that really
      // matters is the curly braces match.
      const json = `{1: 1,
//  false: false,
//  {}: true,
//  []: null,
//  [,,,]: [1, 2.0, 3e10, 3e-10, 3e+10, 3.14, -1.23]
//  "nocomma"
//  "nocolon" {
//    "g"] [1, "\\"string\\"", {}]
//  }
//}`;
      expect(() => {
        JSON.parse(json);
      }).toThrow("Unexpected number in JSON at position 1"); // It is not valid JSON
      const result = lexer.tokenize(`:block-command-start: ${json}`);
      expect(result.errors.length).toBe(0);
      expect(result.tokens[0].image).toBe(":block-command-start:");
      expect(result.tokens[1].image).toBe("{");
      parser.input = result.tokens.slice(1); // CommandStart required to get lexer in JSON mode
      parser.attributeList();
      expect(parser.errors).toStrictEqual([]); // JSON invalid, but it is still ok
    });

    it("rejects block comment start tokens in json", () => {
      const json = `{
  /*
}
`;
      expect(() => {
        JSON.parse(json);
      }).toThrow("Unexpected token / in JSON at position 4"); // It is not valid JSON
      const result = lexer.tokenize(`:block-command-start: ${json}`);
      expect(result.errors.length).toBe(0);
      expect(result.tokens[0].image).toBe(":block-command-start:");
      expect(result.tokens[1].image).toBe("{");
      parser.input = result.tokens.slice(1); // CommandStart required to get lexer in JSON mode
      parser.attributeList();
      expect(parser.errors[0].message).toBe(
        "1:24(23) attributeList: After Newline, expected AttributeListEnd but found BlockCommentStart"
      );
    });

    it("rejects block comment end tokens in json", () => {
      const json = `{
  */
}
`;
      expect(() => {
        JSON.parse(json);
      }).toThrow("Unexpected token * in JSON at position 4"); // It is not valid JSON
      const result = lexer.tokenize(`:block-command-start: ${json}`);
      expect(result.errors.length).toBe(0);
      expect(result.tokens[0].image).toBe(":block-command-start:");
      expect(result.tokens[1].image).toBe("{");
      parser.input = result.tokens.slice(1); // CommandStart required to get lexer in JSON mode
      parser.attributeList();
      expect(parser.errors[0].message).toBe(
        "1:24(23) attributeList: After Newline, expected AttributeListEnd but found BlockCommentEnd"
      );
    });

    it("diagnoses unterminated attribute lists", () => {
      const json = `{
  "a": 1
`;
      expect(() => {
        JSON.parse(json);
      }).toThrow("Unexpected end of JSON input"); // It is not valid JSON
      const result = lexer.tokenize(`:block-command-start: ${json}`);
      expect(result.errors.length).toBe(0);
      expect(result.tokens[0].image).toBe(":block-command-start:");
      expect(result.tokens[1].image).toBe("{");
      parser.input = result.tokens.slice(1); // CommandStart required to get lexer in JSON mode
      parser.attributeList();
      expect(parser.errors[0].message).toBe(
        "2:9(32) attributeList: After Newline, expected AttributeListEnd but found EOF"
      );
    });

    it("handles many nested JSON objects", () => {
      const json = `{"a":{"a":{"a":{"a":{"a":{"a":{"a":{"a":{"a":{}}}}}}}}}}`;
      // It is valid JSON
      expect(JSON.parse(json)).toStrictEqual({
        a: { a: { a: { a: { a: { a: { a: { a: { a: {} } } } } } } } },
      });
      const result = lexer.tokenize(`:block-command-start: ${json}`);
      expect(result.errors.length).toBe(0);
      expect(result.tokens[0].image).toBe(":block-command-start:");
      expect(result.tokens[1].image).toBe("{");
      parser.input = result.tokens.slice(1); // CommandStart required to get lexer in JSON mode
      parser.attributeList();
      expect(parser.errors).toStrictEqual([]);
    });
  });

  describe("annotatedText rule (main parser)", () => {
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

    it("accepts block commands that straddle inside of comment blocks", () => {
      const test_string = `:block-command-start: */
chunky chunky
/* :block-command-end:`;
      const result = lexer.tokenize(test_string);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.blockCommand();
      expect(parser.errors).toStrictEqual([]);
    });

    it("rejects block commands that straddle outside of comment blocks", () => {
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
        "3:23(39) blockComment: After Newline, expected BlockCommentEnd but found CommandEnd"
      );
    });

    it("rejects extra block comment end that straddles inside of comment", () => {
      const test_string = `:block-command-start: */ */
chunky chunky
/* :block-command-end:`;
      const result = lexer.tokenize(test_string);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.annotatedText();
      expect(parser.errors[0].message).toBe(
        "1:23(22) blockCommandUncommentedContents: After BlockCommentEnd, expected Newline but found BlockCommentEnd"
      );
    });

    it("rejects extra block comment start that straddles inside of comment", () => {
      const test_string = `:block-command-start: */
chunky chunky
/* /* :block-command-end:`;
      const result = lexer.tokenize(test_string);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.annotatedText();
      expect(parser.errors[0].message).toBe(
        "3:4(42) blockComment: After BlockCommentStart, expected BlockCommentEnd but found CommandEnd"
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

    it("accepts line-commented block commands", () => {
      const result = lexer.tokenize(`// :block-command-start: attribute
any text
:block-command-end:
`); // it doesn't care if you comment the end block
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.annotatedText();
      expect(parser.errors).toStrictEqual([]);
    });

    it("accepts line-commented block commands with inner line comments", () => {
      const result = lexer.tokenize(`// :block-command-start: attribute
// any text
:block-command-end:
`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.annotatedText();
      expect(parser.errors).toStrictEqual([]);
    });

    it("fails on incomplete line-commented block commands", () => {
      const result = lexer.tokenize(`// :block-command-start: attribute
// forgot to close
`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.annotatedText();
      expect(parser.errors[0].message).toBe(
        "2:19(53) blockCommand: After Newline, expected CommandEnd but found EOF"
      );
    });

    it("accepts line-commented block commands with many line comments before the end", () => {
      const result = lexer.tokenize(`// :block-command-start: attribute
// // // // // // // // // // // // // // :block-command-end:
`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.annotatedText();
      expect(parser.errors).toStrictEqual([]);
    });

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
        "3:21(40) blockCommand: After Newline, expected CommandEnd but found EOF"
      );
    });

    it("rejects CommandEnd outside of blockCommand", () => {
      const result = lexer.tokenize(`
not in a code block
:code-block-end: //
`);
      expect(result.errors.length).toBe(0);
      // "input" is a setter which will reset the parser's state
      parser.input = result.tokens;
      parser.annotatedText();
      expect(parser.errors[0].message).toStrictEqual(
        "3:1(21) undefined: expecting EOF but found CommandEnd"
      );
    });

    it("does not require newline at end of file", () => {
      const result = lexer.tokenize(`:command-start:
:command-end:`);
      expect(result.errors.length).toBe(0);
      // "input" is a setter which will reset the parser's state
      parser.input = result.tokens;
      parser.annotatedText();
      expect(parser.errors).toStrictEqual([]);
    });
  });

  describe("without nested block comments", () => {
    const parser = new RootParser([
      ...makeBlockCommentTokens(/\/\*/y, /\*\//y, { canNest: false }),
      makeLineCommentToken(/\/\//),
    ]);
    const { lexer } = parser;

    it("cannot nest block comments", () => {
      const result = lexer.tokenize(`/* /* */ */`);
      expect(result.errors.length).toBe(0);
      parser.input = result.tokens;
      parser.annotatedText();
      expect(parser.errors[0].message).toBe(
        "1:1(0) blockComment: expecting one of these possible token sequences: CommandStart -> Command | LineComment | Newline | BlockCommentStart "
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
        "9:1(173) blockComment: expecting one of these possible token sequences: CommandStart -> Command | LineComment | Newline | BlockCommentStart ",
      ]);
    });
  });
});
