import { makeBlockCommentTokens } from "../lexer/makeBlockCommentTokens";
import { makeLineCommentToken } from "../lexer/makeLineCommentToken";
import { makePushParserTokens } from "../lexer/makePushParserTokens";
import { makeStringLiteralTokens } from "../lexer/makeStringLiteralTokens";
import { RootParser } from "../parser/RootParser";

describe("string literals", () => {
  const swiftyParser = new RootParser([
    makeLineCommentToken(/\/\//y),
    ...makeBlockCommentTokens(/\/\*/y, /\*\//y),

    // Imaginary nested parser tokens
    ...makePushParserTokens({
      pushPattern: /<\?swifty/y,
      popPattern: /\?>/y,
      getInnerVisitor: (v) => v,
      includeTokens: false,
      dummyPushPattern: /<\?/y,
    }),

    // Swift-ish interpolated string literals "this is \(interpolated)"
    ...makeStringLiteralTokens({
      startPattern: /"/y,
      isMultiline: false,
      escapePattern: /\\[\n"]/y,
      interpolation: {
        getInnerVisitor: (v) => v,
        includeTokens: false,
        pushPattern: /\\\(/y,
        popPattern: /\)/y,
        dummyPushPattern: /\(/y,
      },
    }),
  ]);

  it("accepts valid strings", () => {
    const result = swiftyParser.parse(`
let x = "this is a valid string"
`);
    expect(result.errors).toStrictEqual([]);
  });

  it("rejects multiline strings", () => {
    const result = swiftyParser.parse(`
let x = "this is an
ILLEGAL multiline string"
`);
    expect(result.errors[0].message).toContain(
      "stringLiteral: expecting one of these possible token sequences: Newline"
    );
  });

  it("accepts interpolation", () => {
    const result = swiftyParser.parse(`
let x = "this is an \\(interpolated
(string))"
`);
    expect(result.errors).toStrictEqual([]);
  });

  it("rejects different PushParser tokens in interpolation", () => {
    const result = swiftyParser.parse(`
let x = "this is not an <?swifty interpolated
<? string ?> (so newlines are not allowed) ?>"
`);
    expect(result.errors[0].message).toContain(
      "stringLiteral: expecting one of these possible token sequences: Newline"
    );
    // Currently reports at the previous token. If this looks wrong at some
    // point, feel free to update this test.
    expect(result.errors[0].location.offset).toBe(9);
  });

  it("nests interpolation tokens", () => {
    expect(
      swiftyParser.parse(`
let x = "this is \\( (((()))) ) nested interpolation"
`).errors
    ).toStrictEqual([]);
    expect(
      swiftyParser.parse(`
let x = "this is \\( (((()))!  ) oops mismatched tokens"
`).errors[0].message
    ).toContain("After Newline, expected PopParser but found EOF");
  });
});
