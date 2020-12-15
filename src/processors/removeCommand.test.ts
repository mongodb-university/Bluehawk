import { Bluehawk } from "../bluehawk";
import RemoveCommand from "./RemoveCommand";
import { join } from "path";

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

describe("remove Command", () => {
  const bluehawk = new Bluehawk();
  const source = {
    text: singleInput,
    language: "javascript",
    filePath: join(__dirname, "snippet.test.ts"),
  };

  const command = new RemoveCommand({ commandName: "remove" });
  it("returns no text", () => {
    const node = bluehawk.run(source).commands.pop();
    expect(command.process(node).result).toEqual("");
    expect(command.process(node).range).toEqual({ start: 19, end: 154 });
  });
});
