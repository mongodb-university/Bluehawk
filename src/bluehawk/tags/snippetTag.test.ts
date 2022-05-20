import { Bluehawk } from "../bluehawk";
import { Document } from "../Document";
import { SnippetTag } from "./SnippetTag";
import { RemoveTag } from "./RemoveTag";

describe("snippet Tag", () => {
  const bluehawk = new Bluehawk();
  bluehawk.registerTag(SnippetTag);
  bluehawk.registerTag(RemoveTag);
  bluehawk.addLanguage(["js", "swift"], {
    languageId: "javascript",
    blockComments: [[/\/\*/, /\*\//]],
    lineComments: [/\/\/ ?/],
  });

  it("performs extraction", async (done) => {
    const snippet = `describe("some stuff", () => {
  it("foos the bar", () => {
    expect(true).toBeTruthy();
  });
});`;
    const source = new Document({
      text: `const bar = "foo"

// :snippet-start: foo
${snippet}
// :snippet-end:
console.log(bar);
`,
      path: "snippet.test.js",
    });

    const parseResult = bluehawk.parse(source);
    const files = await bluehawk.process(parseResult);
    expect(Object.keys(files)).toStrictEqual([
      "snippet.test.js",
      "snippet.test.snippet.foo.js",
    ]);
    expect(
      files["snippet.test.snippet.foo.js"].document.text.toString()
    ).toBe(`${snippet}\n`);
    done();
  });

  it("dedents the snippet", async (done) => {
    const source = new Document({
      text: `const bar = "foo"
    // :snippet-start: foo
     abc
      def
   ghi
    // :snippet-end:
`,
      path: "snippet.test.js",
    });

    const parseResult = bluehawk.parse(source);
    const files = await bluehawk.process(parseResult);
    expect(
      files["snippet.test.snippet.foo.js"].document.text.toString()
    ).toBe(
      `  abc
   def
ghi
`
    );
    done();
  });

  it("dedents a realistic snippet", async (done) => {
    const source = new Document({
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
      path: "snippet.test.swift",
    });

    const parseResult = bluehawk.parse(source);
    const files = await bluehawk.process(parseResult);
    expect(
      files[
        "snippet.test.snippet.delete-collection.swift"
      ].document.text.toString()
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
    done();
  });

  it("handles empty snippets", async (done) => {
    const source = new Document({
      text: `const bar = "foo"
    // :snippet-start: foo
    // :snippet-end:
`,
      path: "snippet.test.js",
    });

    const parseResult = bluehawk.parse(source);
    const files = await bluehawk.process(parseResult);
    expect(
      files["snippet.test.snippet.foo.js"].document.text.toString()
    ).toBe("");
    done();
  });

  it("handles adjusted offsets", async (done) => {
    const source = new Document({
      text: `some text
// :snippet-start: foo
// :remove-start:
hide this
// :remove-end:
// :snippet-end:
`,
      path: "snippet.test.js",
    });

    const parseResult = bluehawk.parse(source);
    const files = await bluehawk.process(parseResult);
    expect(
      files["snippet.test.snippet.foo.js"].document.text.toString()
    ).toBe("");
    done();
  });

  it("supports nested snippets", async () => {
    const source = new Document({
      text: `some text
// :snippet-start: a
hello
// :snippet-start: b
world
// :snippet-end:
!
// :snippet-end:
`,
      path: "snippet.test.js",
    });

    const parseResult = bluehawk.parse(source);
    const files = await bluehawk.process(parseResult);
    expect(files["snippet.test.snippet.a.js"].document.text.toString()).toBe(
      `hello
world
!
`
    );
    expect(files["snippet.test.snippet.b.js"].document.text.toString()).toBe(
      `world
`
    );

    // Ensure nested snippets don't generate, e.g., snippet.test.snippet.a.snippet.b.js
    expect(Object.keys(files)).toStrictEqual([
      "snippet.test.js",
      "snippet.test.snippet.a.js",
      "snippet.test.snippet.b.js",
    ]);
  });
});
