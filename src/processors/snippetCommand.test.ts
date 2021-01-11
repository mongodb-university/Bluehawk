import { Bluehawk, BluehawkSource } from "../bluehawk";
import { SnippetCommand } from "./SnippetCommand";
import { Processor } from "./Processor";

describe("snippet Command", () => {
  const bluehawk = new Bluehawk();
  const processor = new Processor();
  processor.registerCommand("snippet", SnippetCommand);

  it("performs extraction", () => {
    const snippet = `describe("some stuff", () => {
  it("foos the bar", () => {
    expect(true).toBeTruthy();
  });
});`;
    const source = new BluehawkSource({
      text: `const bar = "foo"

// :snippet-start: foo
${snippet}
// :snippet-end:
console.log(bar);
`,
      language: "javascript",
      filePath: "snippet.test.js",
    });

    const bluehawkResult = bluehawk.run(source);
    const files = processor.process(bluehawkResult);
    expect(Object.keys(files)).toStrictEqual([
      "snippet.test.js",
      "snippet.test.js.codeblock.foo",
    ]);
    expect(files["snippet.test.js.codeblock.foo"].source.text.toString()).toBe(
      `${snippet}\n`
    );
  });

  it("dedents the snippet", () => {
    const source = new BluehawkSource({
      text: `const bar = "foo"
    // :snippet-start: foo
     abc
      def
   ghi
    // :snippet-end:
`,
      language: "javascript",
      filePath: "snippet.test.js",
    });

    const bluehawkResult = bluehawk.run(source);
    const files = processor.process(bluehawkResult);
    expect(files["snippet.test.js.codeblock.foo"].source.text.toString()).toBe(
      `  abc
   def
ghi
`
    );
  });

  it("handles empty snippets", () => {
    const source = new BluehawkSource({
      text: `const bar = "foo"
    // :snippet-start: foo
    // :snippet-end:
`,
      language: "javascript",
      filePath: "snippet.test.js",
    });

    const bluehawkResult = bluehawk.run(source);
    const files = processor.process(bluehawkResult);
    expect(files["snippet.test.js.codeblock.foo"].source.text.toString()).toBe(
      ""
    );
  });
});
