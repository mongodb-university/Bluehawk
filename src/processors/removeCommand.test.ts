import { Bluehawk } from "../bluehawk";
import { BluehawkSource } from "../BluehawkSource";
import { RemoveCommand } from "./RemoveCommand";
import { Processor } from "./Processor";

describe("remove command", () => {
  const bluehawk = new Bluehawk();
  const processor = new Processor();
  processor.registerCommand("remove", RemoveCommand);

  it("strips text", () => {
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

    const source = new BluehawkSource({
      text: singleInput,
      language: "javascript",
      path: "test.js",
    });

    const bluehawkResult = bluehawk.run(source);
    const files = processor.process(bluehawkResult);
    expect(files["test.js"].source.text.toString()).toBe(`const bar = "foo"

console.log(bar);
`);
  });

  it("nests", () => {
    const source = new BluehawkSource({
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
      language: "javascript",
      path: "test.js",
    });

    const bluehawkResult = bluehawk.run(source);
    const files = processor.process(bluehawkResult);
    expect(files["test.js"].source.text.toString()).toBe(
      `a
e
`
    );
  });
});
