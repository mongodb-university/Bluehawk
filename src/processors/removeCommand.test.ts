import { Bluehawk } from "../bluehawk";
import RemoveCommand from "./RemoveCommand";
import Processor from "./Processor";
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

const singleExpected = `const bar = "foo"

console.log(bar);
`;

const doubleInput = `const bar = "foo"

// :remove-start:
describe("some stuff", () => {
  it("foos the bar", () => {
    expect(true).toBeTruthy();
  });
});
// :remove-end:
console.log(bar);
// :remove-start:
console.log("a second remove!")
// :remove-end:
console.log("enterprise enterprise yagne worse is better")
`;
const doubleExpected = `const bar = "foo"

console.log(bar);
console.log("enterprise enterprise yagne worse is better")
`;

describe("remove Command", () => {
  const bluehawk = new Bluehawk();
  let source = {
    text: singleInput,
    language: "javascript",
    filePath: join(__dirname, "snippet.test.ts"),
  };

  const command = new RemoveCommand({ commandName: "remove" });
  Processor.registerCommand(command);
  let output;
  it("works with the command processor", () => {
    output = bluehawk.run(source);
    expect(Processor.process(output, bluehawk)).toEqual(singleExpected);
  });

  it("works with multiple removes in a file", () => {
    source = { ...source, text: doubleInput };
    output = bluehawk.run(source);
    expect(Processor.process(output, bluehawk)).toEqual(doubleExpected);
  });
});
