import { Bluehawk } from "../bluehawk";
import { Document } from "../Document";
import { UncommentCommand } from "./UncommentCommand";
import { RemoveCommand } from "./RemoveCommand";

describe("uncomment command", () => {
  const bluehawk = new Bluehawk();
  bluehawk.registerCommand("uncomment", UncommentCommand);
  bluehawk.registerCommand("remove", RemoveCommand);

  it("uncomments", () => {
    const source = new Document({
      text: `// :uncomment-start:
//comment
no comment
//// double comment
// :uncomment-end:
`,
      language: "javascript",
      path: "uncomment.test.js",
    });

    const parseResult = bluehawk.parse(source);
    const files = bluehawk.process(parseResult);
    expect(files["uncomment.test.js"].source.text.toString()).toBe(
      `comment
no comment
// double comment
`
    );
  });

  it("handles one space after comments", () => {
    const source = new Document({
      text: `// :uncomment-start:
// comment
no comment
// // double comment
// :uncomment-end:
`,
      language: "javascript",
      path: "uncomment.test.js",
    });

    const parseResult = bluehawk.parse(source);
    const files = bluehawk.process(parseResult);
    expect(files["uncomment.test.js"].source.text.toString()).toBe(
      `comment
no comment
// double comment
`
    );
  });

  it("nests", () => {
    const source = new Document({
      text: `// :uncomment-start:
// comment
// // :uncomment-start:
no comment
// // double comment
// // :uncomment-end:
// :uncomment-end:
`,
      language: "javascript",
      path: "uncomment.test.js",
    });

    const parseResult = bluehawk.parse(source);
    const files = bluehawk.process(parseResult);
    expect(files["uncomment.test.js"].source.text.toString()).toBe(
      `comment
no comment
// double comment
`
    );
  });

  it("pairs with remove", () => {
    const source = new Document({
      text: `// :uncomment-start:
// comment
// :remove-start:
// // // //
no comment
// :remove-end:
// // double comment
// :uncomment-end:
`,
      language: "javascript",
      path: "uncomment.test.js",
    });

    const parseResult = bluehawk.parse(source);
    const files = bluehawk.process(parseResult);
    expect(files["uncomment.test.js"].source.text.toString()).toBe(
      `comment
// double comment
`
    );
  });
});
