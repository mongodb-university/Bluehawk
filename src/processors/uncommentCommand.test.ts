import { Bluehawk } from "../bluehawk";
import { BluehawkSource } from "../BluehawkSource";
import { UncommentCommand } from "./UncommentCommand";
import { RemoveCommand } from "./RemoveCommand";
import { Processor } from "./Processor";

describe("uncomment command", () => {
  const bluehawk = new Bluehawk();
  const processor = new Processor();
  processor.registerCommand("uncomment", UncommentCommand);
  processor.registerCommand("remove", RemoveCommand);

  it("uncomments", () => {
    const source = new BluehawkSource({
      text: `// :uncomment-start:
//comment
no comment
//// double comment
// :uncomment-end:
`,
      language: "javascript",
      path: "uncomment.test.js",
    });

    const bluehawkResult = bluehawk.run(source);
    const files = processor.process(bluehawkResult);
    expect(files["uncomment.test.js"].source.text.toString()).toBe(
      `comment
no comment
// double comment
`
    );
  });

  it("handles one space after comments", () => {
    const source = new BluehawkSource({
      text: `// :uncomment-start:
// comment
no comment
// // double comment
// :uncomment-end:
`,
      language: "javascript",
      path: "uncomment.test.js",
    });

    const bluehawkResult = bluehawk.run(source);
    const files = processor.process(bluehawkResult);
    expect(files["uncomment.test.js"].source.text.toString()).toBe(
      `comment
no comment
// double comment
`
    );
  });

  it("nests", () => {
    const source = new BluehawkSource({
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

    const bluehawkResult = bluehawk.run(source);
    const files = processor.process(bluehawkResult);
    expect(files["uncomment.test.js"].source.text.toString()).toBe(
      `comment
no comment
// double comment
`
    );
  });

  it("pairs with remove", () => {
    const source = new BluehawkSource({
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

    const bluehawkResult = bluehawk.run(source);
    const files = processor.process(bluehawkResult);
    expect(files["uncomment.test.js"].source.text.toString()).toBe(
      `comment
// double comment
`
    );
  });
});
