import { Bluehawk } from "../bluehawk";
import { BluehawkSource } from "../BluehawkSource";
import { RemoveCommand } from "./RemoveCommand";
import { Processor } from "./Processor";
import MagicString from "magic-string";

describe("remove command", () => {
  const bluehawk = new Bluehawk();
  const processor = new Processor();
  processor.registerCommand("remove", RemoveCommand);
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
