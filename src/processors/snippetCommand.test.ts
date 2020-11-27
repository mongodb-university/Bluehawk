import { Bluehawk, BluehawkResult } from "../bluehawk";
import SnippetCommand from "./SnippetCommand";
import Processor from "./Processor";
import { join } from "path";

const singleSnippet = `const bar = "foo"

// :snippet-start: foo
describe("some stuff", () => {
  it("foos the bar", () => {
    expect(true).toBeTruthy();
  });
});
// :snippet-end:
console.log(bar);
`;

const snippetOneOnly = `describe("some stuff", () => {
  it("foos the bar", () => {
    expect(true).toBeTruthy();
  });
});
`;

const post = `const bar = "foo"

describe("some stuff", () => {
  it("foos the bar", () => {
    expect(true).toBeTruthy();
  });
});
console.log(bar);
`;

const doubleSnippetIn = `const bar = "foo"

// :snippet-start: foo
describe("some stuff", () => {
  it("foos the bar", () => {
    expect(true).toBeTruthy();
  });
});
// :snippet-end:
console.log(bar);
// :snippet-start: baz
console.log("a second snippet!")
// :snippet-end:
console.log("enterprise enterprise yagne worse is better")
`;
const doubleSnippetOut = `const bar = "foo"

describe("some stuff", () => {
  it("foos the bar", () => {
    expect(true).toBeTruthy();
  });
});
console.log(bar);
console.log("a second snippet!")
console.log("enterprise enterprise yagne worse is better")
`;
const nestedIn = `const bar = "foo"

// :snippet-start: bizzle
describe("some stuff", () => {
  it("foos the bar", () => {
    expect(true).toBeTruthy();
  });
});
console.log(bar);
// :snippet-start: bazzle
console.log("a second snippet!")
// :snippet-end:
// :snippet-start: baz-sibling
console.log("Hello Chris!")
// :snippet-end:
// :snippet-end:
console.log("enterprise enterprise yagne worse is better")
`;
const nestedOut = `const bar = "foo"

describe("some stuff", () => {
  it("foos the bar", () => {
    expect(true).toBeTruthy();
  });
});
console.log(bar);
console.log("a second snippet!")
console.log("Hello Chris!")
console.log("enterprise enterprise yagne worse is better")
`;
describe("snippet Command", () => {
  const bluehawk = new Bluehawk();
  let source = {
    text: singleSnippet,
    language: "javascript",
    filePath: join(__dirname, "snippet.test.ts"),
  };

  const command = new SnippetCommand({
    commandName: "snippet",
    writeFileMode: false,
    fileOutPath: "",
  });
  Processor.registerCommand(command);
  let output: BluehawkResult;
  it("performs extraction", () => {
    output = bluehawk.run(source);
    expect(command.process(output.commands.pop()).result).toEqual(
      snippetOneOnly
    );
  });
  it("works with the command processor", () => {
    output = bluehawk.run(source);
    expect(Processor.process(output, bluehawk)).toEqual(post);
  });

  it("works with multiple snippets in a file", () => {
    source = { ...source, text: doubleSnippetIn };
    output = bluehawk.run(source);
    expect(Processor.process(output, bluehawk)).toEqual(doubleSnippetOut);
  });
  it("works with nested and sibling snippets", () => {
    source = { ...source, text: nestedIn };
    output = bluehawk.run(source);
    expect(Processor.process(output, bluehawk)).toEqual(nestedOut);
  });
});
