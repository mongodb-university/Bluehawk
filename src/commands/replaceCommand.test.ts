import { Bluehawk } from "../bluehawk";
import { Document } from "../Document";
import { ReplaceCommand } from "./ReplaceCommand";
import { RemoveCommand } from "./RemoveCommand";

describe("replace command", () => {
  const bluehawk = new Bluehawk();
  bluehawk.registerCommand("replace", ReplaceCommand);
  bluehawk.registerCommand("remove", RemoveCommand);

  it("errors when no attribute list is given", () => {
    const source = new Document({
      text: `// :replace-start:
// :replace-end:
`,
      language: "javascript",
      path: "replace.test.js",
    });

    const parseResult = bluehawk.parse(source);
    expect(parseResult.errors[0].message).toBe(
      "attribute list for 'replace' command should be object"
    );
  });

  it("errors when invalid attribute list is given", () => {
    const source = new Document({
      text: `// :replace-start: {"terms":{"numbersNotAllowed": 1}}
// :replace-end:
`,
      language: "javascript",
      path: "replace.test.js",
    });

    const parseResult = bluehawk.parse(source);
    expect(parseResult.errors[0].message).toBe(
      "attribute list for 'replace' command/terms/numbersNotAllowed should be string"
    );
  });

  it("replaces keys with values", () => {
    const source = new Document({
      text: `// :replace-start: {
// "terms": {
//   "Replace Me": "It works!",
//   "test2": "--replaced--"
// }}
leave this alone
go ahead and Replace Me
and see test2
// :replace-end:
`,
      language: "javascript",
      path: "replace.test.js",
    });

    const parseResult = bluehawk.parse(source);
    expect(parseResult.errors).toStrictEqual([]);
    const files = bluehawk.process(parseResult);
    expect(files["replace.test.js"].source.text.toString())
      .toBe(`leave this alone
go ahead and It works!
and see --replaced--
`);
  });

  it("is case sensitive", () => {
    const source = new Document({
      text: `// :replace-start: {"terms": {
//   "Notice the Case": "It works!",
//   "UNCHANGED": "changed"
// }}
leave this alone
go ahead and notice the case
and see unchanged
// :replace-end:
`,
      language: "javascript",
      path: "replace.test.js",
    });

    const parseResult = bluehawk.parse(source);
    expect(parseResult.errors.length).toBe(0);
    const files = bluehawk.process(parseResult);
    expect(files["replace.test.js"].source.text.toString())
      .toBe(`leave this alone
go ahead and notice the case
and see unchanged
`);
  });

  it("replaces all instances within the block", () => {
    const source = new Document({
      text: `replaceme
replaceme
---
// :replace-start: {
//   "terms": {"replaceme": "replaced"}
// }
replaceme
left alone
replaceme
replaceme
left alone
and replaceme
// :replace-end:
---
replaceme
replaceme
replaceme
`,
      language: "javascript",
      path: "replace.test.js",
    });

    const parseResult = bluehawk.parse(source);
    expect(parseResult.errors.length).toBe(0);
    const files = bluehawk.process(parseResult);
    expect(files["replace.test.js"].source.text.toString()).toBe(`replaceme
replaceme
---
replaced
left alone
replaced
replaced
left alone
and replaced
---
replaceme
replaceme
replaceme
`);
  });

  it("can't match outside of its block", () => {
    const source = new Document({
      text: `// :replace-start: {"terms": {
//   ":replace-": "hacked"
// }}
:replace- :replace- :rep
:replace-end:
`,
      language: "javascript",
      path: "replace.test.js",
    });

    const parseResult = bluehawk.parse(source);
    expect(parseResult.errors).toStrictEqual([]);
    const files = bluehawk.process(parseResult);
    expect(files["replace.test.js"].source.text.toString()).toBe(
      `hacked hacked :rep\n`
    );
  });

  it("interoperates with remove", () => {
    const source = new Document({
      text: `// :replace-start: {"terms": {
//   "removethis": ""
// }}
leave this alone
removethis1
// :remove-start:
removethis2
removethis3
// :remove-end:
removethis4
andremovethisaswell
// :replace-end:
`,
      language: "javascript",
      path: "replace.test.js",
    });

    const parseResult = bluehawk.parse(source);
    expect(parseResult.errors.length).toBe(0);
    const files = bluehawk.process(parseResult);
    expect(files["replace.test.js"].source.text.toString())
      .toBe(`leave this alone
1
4
andaswell
`);
  });

  it("doesn't unexpectedly use id as a replacement", () => {
    const source = new Document({
      text: `// :replace-start: foo
it's my id
:replace-end:
`,
      language: "javascript",
      path: "replace.test.js",
    });

    const parseResult = bluehawk.parse(source);
    expect(parseResult.errors[0].message).toBe(
      "attribute list for 'replace' command should have required property 'terms'"
    );
  });
});
