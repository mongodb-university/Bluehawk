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

describe("snippet Command", () => {
  const bluehawk = new Bluehawk();
  const source = {
    text: singleSnippet,
    language: "javascript",
    filePath: join(__dirname, "snippet.test.ts"),
  };

  const command = new SnippetCommand({
    commandName: "snippet",
  });
  Processor.registerCommand(command);
  let output: BluehawkResult;
  it("performs extraction", () => {
    output = bluehawk.run(source);
    expect(command.process(output.commands.pop()).result).toEqual(
      snippetOneOnly
    );
  });
});
