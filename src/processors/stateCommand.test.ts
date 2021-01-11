import { join } from "path";
import { Bluehawk, BluehawkSource } from "../bluehawk";
import { Processor } from "./Processor";
import { StateCommand } from "./StateCommand";
import { RemoveCommand } from "./RemoveCommand";
import { SnippetCommand } from "./SnippetCommand";

describe("stateCommand", () => {
  const bluehawk = new Bluehawk();
  const singleInput = new BluehawkSource({
    text: `
// :state-start: begin
// let foo = undefined;
// console.log(foo);
// :state-end:
// :state-start: final
// let foo = defined;
// console.log(foo);
// :state-end:
end
`,
    language: "javascript",
    filePath: join(__dirname, "stateCommand.test.ts"),
  });
  const singleBegin = `
let foo = undefined;
console.log(foo);
end
`;
  const singleEnd = `
let foo = defined;
console.log(foo);
end
`;

  const nestedInput = new BluehawkSource({
    text: `
// :state-start: begin
// let foo = undefined;
// console.log(foo);
// :remove-start:
someTest()
// :remove-end:
// :state-end:
// :state-start: final
// let foo = defined;
// console.log(foo);
// :state-end:
end
`,
    language: "javascript",
    filePath: "stateCommand.test.js",
  });
  const nestedBegin = `
let foo = undefined;
console.log(foo);
end
`;
  const nestedFinal = `
let foo = defined;
console.log(foo);
end
`;

  const processor = new Processor();
  processor.registerCommand("state", StateCommand);
  processor.registerCommand("remove", RemoveCommand);
  processor.registerCommand("snippet", SnippetCommand);

  it("processes nested commands", () => {
    const multipleInput = new BluehawkSource({
      text: `
// :state-start: begin
// let foo = undefined;
// console.log(foo);
// :remove-start:
someTest()
// :remove-end:
// :state-end:
// :remove-start:
flibbertyflappity
// :remove-end:
// :snippet-start: foo
console.log("we are foo");
// :snippet-end:
// :state-start: final
// let foo = defined;
// console.log(foo);
// :state-end:
end
`,
      language: "javascript",
      filePath: "stateCommand.test.js",
    });
    const multipleBegin = `
let foo = undefined;
console.log(foo);
console.log("we are foo");
end
`;
    const multipleFinal = `
console.log("we are foo");
// let foo = defined;
// console.log(foo);
end
`;
    const bluehawkResult = bluehawk.run(multipleInput);
    expect(bluehawkResult.source.filePath).toBe("stateCommand.test.js");
    const files = processor.process(bluehawkResult);
    // wait what? Two snippets?
    // It's because the snippet lives outside of the states
    // There would only be one snippet publish if it was nested
    expect(Object.keys(files)).toStrictEqual([
      "stateCommand.test.js",
      "stateCommand.test.js.state.begin",
      "stateCommand.test.js.state.begin.codeblock.foo",
      "stateCommand.test.js.codeblock.foo",
      "stateCommand.test.js.state.final",
      "stateCommand.test.js.state.final.codeblock.foo",
    ]);

    expect(
      files["stateCommand.test.js.state.final"].source.text.toString()
    ).toBe(multipleFinal);
  });
});
