import { Bluehawk } from "../bluehawk";
import { Document } from "../Document";
import { EmphasizeCommand } from "./EmphasizeCommand";

describe("emphasize command", () => {
  const bluehawk = new Bluehawk({
    commands: [EmphasizeCommand],
  });

  it("functions as a block", async (done) => {
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
      language: "javascript",
      path: "test.js",
    });

    const parseResult = bluehawk.parse(source);
    const files = await bluehawk.process(parseResult);
    expect(files["test.js"].source.text.toString()).toBe(`const bar = "foo"

describe("some stuff", () => {
  it("foos the bar", () => {
    expect(true).toBeTruthy();
  });
});
console.log(bar);
`);

    expect(
      files["test.js"].source.attributes["emphasize"]["ranges"]
    ).toStrictEqual([{ start: 3, end: 7 }]);
    done();
  });

  it("works as a one line command", async (done) => {
    const source = new Document({
      text: `a
// :emphasize:
b
c
`,
      language: "javascript",
      path: "test.js",
    });

    const parseResult = bluehawk.parse(source);
    const files = await bluehawk.process(parseResult);
    expect(files["test.js"].source.text.toString()).toBe(
      `a
b
c
`
    );
    expect(
      files["test.js"].source.attributes["emphasize"]["ranges"]
    ).toStrictEqual([{ start: 2, end: 2 }]);
    done();
  });
});
