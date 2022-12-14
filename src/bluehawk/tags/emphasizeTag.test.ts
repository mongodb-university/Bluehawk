import { Bluehawk } from "../bluehawk";
import { Document } from "../Document";
import { EmphasizeTag } from "./EmphasizeTag";

describe("emphasize tag", () => {
  const bluehawk = new Bluehawk({
    tags: [EmphasizeTag],
  });
  bluehawk.addLanguage("js", {
    languageId: "javascript",
    blockComments: [[/\/\*/, /\*\//]],
    lineComments: [/\/\/ ?/],
  });

  it("works as a one line tag", async () => {
    const source = new Document({
      text: `a
b // :emphasize:
c
`,
      path: "test.js",
    });

    const parseResult = bluehawk.parse(source);
    const files = await bluehawk.process(parseResult);
    expect(files["test.js"].document.text.toString()).toBe(
      `a
b 
c
`
    );
    expect(
      files["test.js"].document.attributes["emphasize"]["ranges"]
    ).toMatchObject([
      {
        start: {
          line: 2,
        },
        end: { line: 2 },
      },
    ]);
  });

  it("functions as a block", async () => {
    const singleInput = `const bar = "foo"

// :emphasize-start:
describe("some stuff", () => {
  it("foos the bar", () => {
    expect(true).toBeTruthy();
  });
});
// :emphasize-end:
console.log(bar);
`;

    const source = new Document({
      text: singleInput,
      path: "test.js",
    });

    const parseResult = bluehawk.parse(source);
    const files = await bluehawk.process(parseResult);
    expect(files["test.js"].document.text.toString()).toBe(`const bar = "foo"

describe("some stuff", () => {
  it("foos the bar", () => {
    expect(true).toBeTruthy();
  });
});
console.log(bar);
`);

    expect(
      files["test.js"].document.attributes["emphasize"]["ranges"]
    ).toMatchObject([
      {
        start: {
          line: 4,
        },
        end: { line: 8 },
      },
    ]);
  });

  it("handles double blocks correctly", async () => {
    const singleInput = `const bar = "foo"

// :emphasize-start:
describe("some stuff", () => {
  // :emphasize-end:
  it("foos the bar", () => {
    expect(true).toBeTruthy();
  });
  // :emphasize-start:
});
// :emphasize-end:
console.log(bar);
`;

    const source = new Document({
      text: singleInput,
      path: "test.js",
    });

    const parseResult = bluehawk.parse(source);
    const files = await bluehawk.process(parseResult);
    expect(files["test.js"].document.text.toString()).toBe(`const bar = "foo"

describe("some stuff", () => {
  it("foos the bar", () => {
    expect(true).toBeTruthy();
  });
});
console.log(bar);
`);

    expect(
      files["test.js"].document.attributes["emphasize"]["ranges"]
    ).toMatchObject([
      {
        start: {
          line: 4,
        },
        end: { line: 4 },
      },
      {
        start: {
          line: 10,
        },
        end: { line: 10 },
      },
    ]);
  });

  it("handles block and line usages correctly when combined", async () => {
    const singleInput = `line 1
line 2
// :emphasize-start:
line 3
// :emphasize-end:
line 4
line 5 // :emphasize:
line 6
// :emphasize-start:
line 7
line 8
// :emphasize-end:
line 9`;

    const source = new Document({
      text: singleInput,
      path: "test.js",
    });

    const parseResult = bluehawk.parse(source);
    const files = await bluehawk.process(parseResult);
    expect(files["test.js"].document.text.toString()).toBe(`line 1
line 2
line 3
line 4
line 5 
line 6
line 7
line 8
line 9`);

    expect(
      files["test.js"].document.attributes["emphasize"]["ranges"]
    ).toMatchObject([
      {
        start: {
          line: 4,
        },
        end: { line: 4 },
      },
      {
        start: {
          line: 7,
        },
        end: { line: 7 },
      },
      {
        start: {
          line: 10,
        },
        end: { line: 11 },
      },
    ]);
  });
});
