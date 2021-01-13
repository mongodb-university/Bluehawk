import { Bluehawk } from "../bluehawk";
import { BluehawkSource } from "../BluehawkSource";
import { SnippetCommand } from "./SnippetCommand";
import { RemoveCommand } from "./RemoveCommand";
import { Processor } from "./Processor";

describe("snippet Command", () => {
  const bluehawk = new Bluehawk();
  const processor = new Processor();
  processor.registerCommand("snippet", SnippetCommand);
  processor.registerCommand("hide", RemoveCommand);

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
      path: "snippet.test.js",
    });

    const bluehawkResult = bluehawk.run(source);
    const files = processor.process(bluehawkResult);
    expect(Object.keys(files)).toStrictEqual([
      "snippet.test.js",
      "./snippet.test.codeblock.foo.js",
    ]);
    expect(
      files["./snippet.test.codeblock.foo.js"].source.text.toString()
    ).toBe(`${snippet}\n`);
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
      path: "snippet.test.js",
    });

    const bluehawkResult = bluehawk.run(source);
    const files = processor.process(bluehawkResult);
    expect(
      files["./snippet.test.codeblock.foo.js"].source.text.toString()
    ).toBe(
      `  abc
   def
ghi
`
    );
  });

  it("dedents a realistic snippet", () => {
    const source = new BluehawkSource({
      text: `        // :snippet-start: delete-collection
        let realm = try! Realm()
        try! realm.write {
            // Find dogs younger than 2 years old.
            let puppies = realm.objects(CrudExample_Dog.self).filter("age < 2")

            // Delete the objects in the collection from the realm.
            realm.delete(puppies);
        }
        // :snippet-end:
`,
      language: "swift",
      path: "snippet.test.swift",
    });

    const bluehawkResult = bluehawk.run(source);
    const files = processor.process(bluehawkResult);
    expect(
      files[
        "./snippet.test.codeblock.delete-collection.swift"
      ].source.text.toString()
    ).toBe(
      `let realm = try! Realm()
try! realm.write {
    // Find dogs younger than 2 years old.
    let puppies = realm.objects(CrudExample_Dog.self).filter("age < 2")

    // Delete the objects in the collection from the realm.
    realm.delete(puppies);
}
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
      path: "snippet.test.js",
    });

    const bluehawkResult = bluehawk.run(source);
    const files = processor.process(bluehawkResult);
    expect(
      files["./snippet.test.codeblock.foo.js"].source.text.toString()
    ).toBe("");
  });

  it("handles adjusted offsets", () => {
    const source = new BluehawkSource({
      text: `some text
// :snippet-start: foo
// :hide-start:
hide this
// :hide-end:
// :snippet-end:
`,
      language: "javascript",
      path: "snippet.test.js",
    });

    const bluehawkResult = bluehawk.run(source);
    const files = processor.process(bluehawkResult);
    expect(
      files["./snippet.test.codeblock.foo.js"].source.text.toString()
    ).toBe("");
  });
});
