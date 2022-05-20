import { Bluehawk } from "../bluehawk";
import { Document } from "../Document";
import { StateTag } from "./StateTag";
import { RemoveTag } from "./RemoveTag";
import { SnippetTag } from "./SnippetTag";

describe("stateTag", () => {
  const bluehawk = new Bluehawk();

  bluehawk.registerTag(StateTag);
  bluehawk.registerTag(RemoveTag);
  bluehawk.registerTag(SnippetTag);
  bluehawk.addLanguage(["js"], {
    languageId: "javascript",
    blockComments: [[/\/\*/, /\*\//]],
    lineComments: [/\/\/ ?/],
  });
  it("processes nested tags", async (done) => {
    const multipleInput = new Document({
      text: `
// :state-start: begin
// let foo = undefined;
// console.log(foo);
// :remove-start:
someTest()
// :remove-end:
// :state-end:
// :remove-start:
flibbertyflappity
// :remove-end:
// :snippet-start: foo
console.log("we are foo");
// :snippet-end:
// :state-start: final
// let foo = defined;
// console.log(foo);
// :state-end:
end
`,
      path: "stateTag.test.js",
    });

    const multipleFinal = `
console.log("we are foo");
// let foo = defined;
// console.log(foo);
end
`;
    const parseResult = bluehawk.parse(multipleInput);
    expect(parseResult.source.path).toBe("stateTag.test.js");
    const files = await bluehawk.process(parseResult);
    // wait what? Two snippets?
    // It's because the snippet lives outside of the states
    // There would only be one snippet publish if it was nested
    expect(Object.keys(files)).toStrictEqual([
      "stateTag.test.js",
      "stateTag.test.js?state=begin",
      "stateTag.test.snippet.foo.js?state=begin",
      "stateTag.test.snippet.foo.js",
      "stateTag.test.js?state=final",
      "stateTag.test.snippet.foo.js?state=final",
    ]);

    expect(files["stateTag.test.js?state=final"].document.text.toString()).toBe(
      multipleFinal
    );
    done();
  });

  it("handles multiple states", async (done) => {
    const multipleInput = new Document({
      text: `
// :state-start: begin
// let foo = undefined;
// console.log(foo);
// :remove-start:
someTest()
// :remove-end:
// :state-end:
// :remove-start:
flibbertyflappity
// :remove-end:
// :snippet-start: foo
console.log("we are foo");
// :snippet-end:
// :state-start: final bar baz
// let foo = defined;
// console.log(foo);
// :state-end:
end
`,
      path: "stateTag.test.js",
    });

    const multipleFinal = `
console.log("we are foo");
// let foo = defined;
// console.log(foo);
end
`;
    const parseResult = bluehawk.parse(multipleInput);
    expect(parseResult.source.path).toBe("stateTag.test.js");
    const files = await bluehawk.process(parseResult);
    // wait what? Two snippets?
    // It's because the snippet lives outside of the states
    // There would only be one snippet publish if it was nested
    expect(Object.keys(files)).toStrictEqual([
      "stateTag.test.js",
      "stateTag.test.js?state=begin",
      "stateTag.test.snippet.foo.js?state=begin",
      "stateTag.test.snippet.foo.js",
      "stateTag.test.js?state=final",
      "stateTag.test.snippet.foo.js?state=final",
      "stateTag.test.js?state=bar",
      "stateTag.test.snippet.foo.js?state=bar",
      "stateTag.test.js?state=baz",
      "stateTag.test.snippet.foo.js?state=baz",
    ]);

    expect(files["stateTag.test.js?state=final"].document.text.toString()).toBe(
      multipleFinal
    );
    expect(files["stateTag.test.js?state=bar"].document.text.toString()).toBe(
      multipleFinal
    );
    expect(files["stateTag.test.js?state=baz"].document.text.toString()).toBe(
      multipleFinal
    );
    done();
  });

  it("handles multiple states declared via attribute list", async (done) => {
    const multipleInput = new Document({
      text: `
// :state-start: begin
// let foo = undefined;
// console.log(foo);
// :remove-start:
someTest()
// :remove-end:
// :state-end:
// :remove-start:
flibbertyflappity
// :remove-end:
// :snippet-start: foo
console.log("we are foo");
// :snippet-end:
// :state-start: {
// "id": [ "final", "bar", "baz" ]}
// let foo = defined;
// console.log(foo);
// :state-end:
end
`,
      path: "stateTag.test.js",
    });

    const multipleFinal = `
console.log("we are foo");
// let foo = defined;
// console.log(foo);
end
`;
    const parseResult = bluehawk.parse(multipleInput);
    expect(parseResult.source.path).toBe("stateTag.test.js");
    const files = await bluehawk.process(parseResult);
    // wait what? Two snippets?
    // It's because the snippet lives outside of the states
    // There would only be one snippet publish if it was nested
    expect(Object.keys(files)).toStrictEqual([
      "stateTag.test.js",
      "stateTag.test.js?state=begin",
      "stateTag.test.snippet.foo.js?state=begin",
      "stateTag.test.snippet.foo.js",
      "stateTag.test.js?state=final",
      "stateTag.test.snippet.foo.js?state=final",
      "stateTag.test.js?state=bar",
      "stateTag.test.snippet.foo.js?state=bar",
      "stateTag.test.js?state=baz",
      "stateTag.test.snippet.foo.js?state=baz",
    ]);

    expect(files["stateTag.test.js?state=final"].document.text.toString()).toBe(
      multipleFinal
    );
    expect(files["stateTag.test.js?state=bar"].document.text.toString()).toBe(
      multipleFinal
    );
    expect(files["stateTag.test.js?state=baz"].document.text.toString()).toBe(
      multipleFinal
    );
    done();
    done();
  });
});
