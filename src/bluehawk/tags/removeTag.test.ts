import { Bluehawk } from "../bluehawk";
import { Document } from "../Document";
import { RemoveTag } from "./RemoveTag";
import MagicString from "magic-string";

describe("remove tag", () => {
  const bluehawk = new Bluehawk();
  bluehawk.registerTag(RemoveTag);
  bluehawk.addLanguage("js", {
    languageId: "javascript",
    blockComments: [[/\/\*/, /\*\//]],
    lineComments: [/\/\/ ?/],
  });

  test("magic string allows double delete", () => {
    // Check assumptions about magic string. At time of writing, magic string
    // docs claim that "removing the same content twice, or making removals that
    // partially overlap, will cause an error." In practice, this doesn't seem
    // to be the case. In the interest of keeping processor code simple,
    // Bluehawk relies on being able to delete the same thing multiple times.
    const s = new MagicString(`line 1
line 2
line 3`);
    expect(s.length()).toBe(s.original.length);
    const lines = s.original.split("\n");
    s.remove(0, lines[0].length + 1);
    expect(s.length()).toBe(s.original.length - lines[0].length - 1);
    s.remove(0, lines[0].length + 1); // Delete again -- no error
    expect(s.length()).toBe(s.original.length - lines[0].length - 1);
    expect(s.toString()).toBe(`line 2
line 3`);
    s.remove(3, 6); // Delete inner field again -- no error
    expect(s.length()).toBe(s.original.length - lines[0].length - 1);
    expect(s.toString()).toBe(`line 2
line 3`);
    s.remove(0, lines[0].length + lines[1].length + 2); // Delete overlapping field
    expect(s.length()).toBe(
      s.original.length - lines[0].length - lines[1].length - 2
    );
    expect(s.toString()).toBe(`line 3`);
  });

  it("strips text", async (done) => {
    const singleInput = `const bar = "foo"

// :remove-start:
describe("some stuff", () => {
  it("foos the bar", () => {
    expect(true).toBeTruthy();
  });
});
// :remove-end:
console.log(bar);
`;

    const inputFile = new Document({
      text: singleInput,
      path: "test.js",
    });

    const parseResult = bluehawk.parse(inputFile);
    const files = await bluehawk.process(parseResult);
    expect(files["test.js"].document.text.toString()).toBe(`const bar = "foo"

console.log(bar);
`);
    done();
  });

  it("nests", async (done) => {
    const inputFile = new Document({
      text: `a
:remove-start:
b
:remove-start:
c
:remove-end:
d
:remove-end:
e
`,
      path: "test.js",
    });

    const parseResult = bluehawk.parse(inputFile);
    const files = await bluehawk.process(parseResult);
    expect(files["test.js"].document.text.toString()).toBe(
      `a
e
`
    );
    done();
  });

  it("requires no attributes", () => {
    const input = `// :remove-start: {
  "id": "hey"
}
// :remove-end:
`;

    const inputFile = new Document({
      text: input,
      path: "test.js",
    });

    const parseResult = bluehawk.parse(inputFile);
    expect(parseResult.errors[0].message).toStrictEqual(
      "attribute list for 'remove' tag should be null"
    );
  });

  it("works as a line tag", async (done) => {
    const input = `leave this
this should be removed // :remove:
and leave this
this should also be removed // :remove: // do it
but not this
`;

    const inputFile = new Document({
      text: input,
      path: "test.js",
    });

    const parseResult = bluehawk.parse(inputFile);
    const files = await bluehawk.process(parseResult);
    expect(files["test.js"].document.text.toString()).toBe(
      `leave this
and leave this
but not this
`
    );
    done();
  });
});
