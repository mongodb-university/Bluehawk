import { idIsUnique } from "./processor/validator";
import { Bluehawk } from "./bluehawk";
import { Document } from "./Document";
import {
  IdRequiredAttributes,
  IdRequiredAttributesSchema,
  makeBlockTag,
} from "./tags";
import { System } from "./io/System";
import { getBluehawk } from "./getBluehawk";

describe("bluehawk", () => {
  beforeEach(System.useMemfs);

  const bluehawk = new Bluehawk();
  bluehawk.registerTag(
    makeBlockTag<IdRequiredAttributes>({
      name: "snippet",
      attributesSchema: IdRequiredAttributesSchema,
      process(request) {
        return;
      },
      rules: [idIsUnique],
    })
  );
  bluehawk.addLanguage([""], {
    languageId: "javascript",
    blockComments: [[/\/\*/, /\*\//]],
    lineComments: [/\/\/ ?/],
  });

  it("handles lexing, parsing, visiting, and validating", () => {
    const input = new Document({
      text: `
    this is ignored
    :some-tag-start:
    this is in the tag
    :some-tag-end:
`,
      path: "testPath",
    });
    const output = bluehawk.parse(input);
    expect(output.errors).toStrictEqual([]);
  });

  it("contains lexing errors", () => {
    const input = new Document({
      text: `
    :some-tag-start: '
    this is ignored
    :some-tag-end:
    `,
      path: "testPath",
    });
    const output = bluehawk.parse(input);
    expect(output.errors.length).toBe(1);
    expect(output.errors[0]).toStrictEqual({
      component: "lexer",
      location: {
        column: 22,
        line: 2,
        offset: 22,
      },
      message:
        "unexpected character: ->'<- at offset: 22, skipped 1 characters.",
    });
  });

  it("contains parsing errors", () => {
    const input = new Document({
      text: `
    this is ignored
    :some-tag-start:
    this is in the tag
    :some-tag-start:
`,
      path: "testPath",
    });
    const output = bluehawk.parse(input);
    expect(output.errors.length).toBe(1);
    expect(output.errors[0]).toStrictEqual({
      component: "parser",
      location: {
        column: 21,
        line: 5,
        offset: 85,
      },
      message:
        "5:21(85) blockTag: After Newline, expected TagEnd but found EOF",
    });
  });

  it("contains visiting errors", () => {
    // TODO: come up with a decent visiting error
    const input = new Document({
      text: `
    this is ignored
    :some-tag-start:
    this is in the tag
    :some-tag-end:
`,
      path: "testPath",
    });
    const output = bluehawk.parse(input);
    expect(output.errors.length).toBe(0);
    expect(output.errors[0]).toStrictEqual(undefined);
  });

  it("contains validating errors", () => {
    const input = new Document({
      text: `
    this is ignored
    :snippet-start:
    this is in the tag
    :snippet-end:
`,
      path: "testPath",
    });
    const output = bluehawk.parse(input);
    expect(output.errors.length).toBe(1);
    expect(output.errors[0]).toStrictEqual({
      component: "validator",
      location: {
        column: 5,
        line: 3,
        offset: 25,
      },
      message: "attribute list for 'snippet' tag should be object",
    });
  });

  it("calls async listeners only once per document", async (done) => {
    System.useJsonFs({
      "/path/to/code.js": `
    this is ignored
    :snippet-start: foo
    :emphasize-start:
    this is in the tag
    :emphasize-end:
    :snippet-end:
`,
    });
    const calledForPath: string[] = [];
    const bluehawk = await getBluehawk.reset();
    bluehawk.subscribe((result) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          calledForPath.push(result.document.path);
          resolve();
        }, 50);
      });
    });

    await bluehawk.parseAndProcess("/path/to");
    expect(calledForPath).toStrictEqual([
      "/path/to/code.snippet.foo.js",
      "/path/to/code.js",
    ]);
    setTimeout(() => {
      expect(calledForPath).toStrictEqual([
        "/path/to/code.snippet.foo.js",
        "/path/to/code.js",
      ]);
      done();
    }, 200);
  });
});
