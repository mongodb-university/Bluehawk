import { fail } from "yargs";
import { Bluehawk } from "../bluehawk";
import { Document } from "../Document";
import { RemoveStateTag } from "./RemoveStateTag";
import { StateTag } from "./StateTag";

describe("remove state tag", () => {
  const bluehawk = new Bluehawk();
  bluehawk.registerTag(RemoveStateTag);
  bluehawk.registerTag(StateTag);
  bluehawk.addLanguage("js", {
    languageId: "javascript",
    blockComments: [[/\/\*/, /\*\//]],
    lineComments: [/\/\/ ?/],
  });

  it("strips text", async (done) => {
    const input = `t0
// :state-start: s1 s2
t1
// :state-end:
// :remove-state-start: s1
t2
// :remove-state-end:
`;

    const source = new Document({
      text: input,
      path: "test.js",
    });

    const parseResult = bluehawk.parse(source);
    const files = await bluehawk.process(parseResult);
    expect(files["test.js"].document.text.toString()).toBe(`t0
t2
`);
    expect(files["test.js?state=s1"].document.text.toString()).toBe(`t0
t1
`);
    expect(files["test.js?state=s2"].document.text.toString()).toBe(`t0
t1
t2
`);
    done();
  });

  it("nests", async (done) => {
    const input = `1
// :remove-state-start: s1
2
// :remove-state-start: s1 s2
3
// :remove-state-start: s1 s2 s3
4
// :remove-state-end:
5
// :remove-state-end:
6
// :remove-state-end:
7
`;
    const source = new Document({
      text: input,
      path: "test.js",
    });
    const parseResult = bluehawk.parse(source);
    const files = await bluehawk.process(parseResult);

    expect(files["test.js"].document.text.toString()).toBe(`1
2
3
4
5
6
7
`);
    expect(files["test.js?state=s1"].document.text.toString()).toBe(`1
7
`);
    expect(files["test.js?state=s2"].document.text.toString()).toBe(`1
2
6
7
`);
    expect(files["test.js?state=s3"].document.text.toString()).toBe(`1
2
3
5
6
7
`);
    done();
  });
});
