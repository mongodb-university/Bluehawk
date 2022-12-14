import { Bluehawk } from "../bluehawk";
import { Document } from "../Document";
import { UncommentTag } from "./UncommentTag";
import { RemoveTag } from "./RemoveTag";

describe("uncomment tag", () => {
  const bluehawk = new Bluehawk();
  bluehawk.registerTag(UncommentTag);
  bluehawk.registerTag(RemoveTag);
  bluehawk.addLanguage(["js"], {
    languageId: "javascript",
    blockComments: [[/\/\*/, /\*\//]],
    lineComments: [/\/\/ ?/],
  });

  it("uncomments", async () => {
    const source = new Document({
      text: `// :uncomment-start:
//comment
no comment
//// double comment
// :uncomment-end:
`,
      path: "uncomment.test.js",
    });

    const parseResult = bluehawk.parse(source);
    const files = await bluehawk.process(parseResult);
    expect(files["uncomment.test.js"].document.text.toString()).toBe(
      `comment
no comment
// double comment
`
    );
  });

  it("handles one space after comments", async () => {
    const source = new Document({
      text: `// :uncomment-start:
// comment
no comment
// // double comment
// :uncomment-end:
`,
      path: "uncomment.test.js",
    });

    const parseResult = bluehawk.parse(source);
    const files = await bluehawk.process(parseResult);
    expect(files["uncomment.test.js"].document.text.toString()).toBe(
      `comment
no comment
// double comment
`
    );
  });

  it("nests", async () => {
    const source = new Document({
      text: `// :uncomment-start:
// comment
// // :uncomment-start:
no comment
// // double comment
// // :uncomment-end:
// :uncomment-end:
`,
      path: "uncomment.test.js",
    });

    const parseResult = bluehawk.parse(source);
    const files = await bluehawk.process(parseResult);
    expect(files["uncomment.test.js"].document.text.toString()).toBe(
      `comment
no comment
// double comment
`
    );
  });

  it("uncomments only at the beginning of the line (after whitespace if any)", async () => {
    const source = new Document({
      text: `// :uncomment-start:
      a//
leave me alone // comment
// uncomment this
leave this alone // // double comment
  // uncomment this // double comment
\t\t// uncomment this
\t\tnot this // though
// :uncomment-end:
`,
      path: "uncomment.test.js",
    });

    const parseResult = bluehawk.parse(source);
    const files = await bluehawk.process(parseResult);
    expect(files["uncomment.test.js"].document.text.toString()).toBe(
      `      a//
leave me alone // comment
uncomment this
leave this alone // // double comment
  uncomment this // double comment
\t\tuncomment this
\t\tnot this // though
`
    );
  });

  it("pairs with remove", async () => {
    const source = new Document({
      text: `// :uncomment-start:
// comment
// :remove-start:
// // // //
no comment
       a // a
             \t\t     // spaced out comment
// :remove-end:
// // double comment
// :uncomment-end:
`,
      path: "uncomment.test.js",
    });

    const parseResult = bluehawk.parse(source);
    const files = await bluehawk.process(parseResult);
    expect(files["uncomment.test.js"].document.text.toString()).toBe(
      `comment
// double comment
`
    );
  });
});
