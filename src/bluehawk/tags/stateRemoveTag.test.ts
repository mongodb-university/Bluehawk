import { doesNotReject } from "assert";
import { fail } from "yargs";
import { Bluehawk } from "../bluehawk";
import { Document } from "../Document";
import { StateRemoveTag } from "./StateRemoveTag";
import { StateTag } from "./StateTag";

describe("remove state tag", () => {
  const bluehawk = new Bluehawk();
  bluehawk.registerTag(StateRemoveTag);
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
// :state-remove-start: s1
t2
// :state-remove-end:
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
// :state-remove-start: s1
2
// :state-remove-start: s1 s2
3
// :state-remove-start: s1 s2 s3
4
// :state-remove-end:
5
// :state-remove-end:
6
// :state-remove-end:
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
  it("behaves well when mixed with state", async (done) => {
    const input = `a
// :state-remove-start: s0
b
// :state-remove-start: s1
c
// :state-start: s2 s3
d
// :state-start: s3
e
// :state-end:
f
// :state-end:
g
// :state-remove-end:
h
// :state-remove-end:
i
`;
    const source = new Document({
      text: input,
      path: "test.js",
    });
    const parseResult = bluehawk.parse(source);
    const files = await bluehawk.process(parseResult);
    expect(files["test.js"].document.text.toString()).toBe(`a
b
c
g
h
i
`);
    expect(files["test.js?state=s0"].document.text.toString()).toBe(`a
i
`);
    expect(files["test.js?state=s1"].document.text.toString()).toBe(`a
b
h
i
`);
    expect(files["test.js?state=s2"].document.text.toString()).toBe(`a
b
c
d
f
g
h
i
`);
    expect(files["test.js?state=s3"].document.text.toString()).toBe(`a
b
c
d
e
f
g
h
i
`);
    done();
  });
});
