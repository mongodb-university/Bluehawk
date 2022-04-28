import { Bluehawk } from "../bluehawk";
import { Document } from "../Document";
import { makeBlockOrLineTag, NoAttributes, NoAttributesSchema } from "./Tag";
import { removeMetaRange } from "./removeMetaRange";

describe("removeMetaRange", () => {
  const bluehawk = new Bluehawk();
  bluehawk.registerTag(
    makeBlockOrLineTag<NoAttributes>({
      attributesSchema: NoAttributesSchema,
      name: "strip-this",
      process({ document, tagNode }) {
        removeMetaRange(document.text, tagNode);
      },
    })
  );
  bluehawk.addLanguage("js", {
    languageId: "javascript",
    blockComments: [[/\/\*/, /\*\//]],
    lineComments: [/\/\/ ?/],
  });

  it("behaves on block tags", async () => {
    // Note that it completely deletes the line on which the -end tag is
    // found.
    const input = new Document({
      text: `const bar = "foo";
// :strip-this-start: {
// "a": 1,
// "b": [1, 2, 3, 
// 4, 5, 6]}
const baz = "bar";
not this
// :strip-this-end:
:not-this:
const qux = "baz";
`,
      path: "strip.test.js",
    });

    const parseResult = bluehawk.parse(input);
    const files = await bluehawk.process(parseResult);
    expect(files["strip.test.js"].document.text.toString()).toBe(
      `const bar = "foo";
const baz = "bar";
not this
:not-this:
const qux = "baz";
`
    );
  });
  it("behaves on line tags", async () => {
    const input = new Document({
      text: `const bar = "foo";
const baz = "bar"; // :strip-this:
:strip-this: :not-this:
const qux = "baz"; // not this :strip-this:
`,
      path: "strip.test.js",
    });

    const parseResult = bluehawk.parse(input);
    const files = await bluehawk.process(parseResult);
    expect(files["strip.test.js"].document.text.toString()).toBe(
      `const bar = "foo";
const baz = "bar"; 
:not-this:
const qux = "baz"; // not this 
`
    );
  });

  it("behaves with doubled-up line tags", async () => {
    const input = new Document({
      text: `abc
def // :strip-this: :strip-this:
ghi // :strip-this: // :strip-this:
jkl //// :strip-this: // :strip-this:
`,
      path: "strip.test.js",
    });

    const parseResult = bluehawk.parse(input);
    const files = await bluehawk.process(parseResult);
    expect(files["strip.test.js"].document.text.toString()).toBe(
      `abc
def 
ghi 
jkl //
`
    );
  });
});
