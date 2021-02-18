import { Bluehawk } from "../bluehawk";
import { Document } from "../Document";
import { StateCommand } from "./StateCommand";
import { RemoveCommand } from "./RemoveCommand";
import { SnippetCommand } from "./SnippetCommand";

describe("stateCommand", () => {
  const bluehawk = new Bluehawk();

  bluehawk.registerCommand(StateCommand);
  bluehawk.registerCommand(RemoveCommand);
  bluehawk.registerCommand(SnippetCommand);

  it("processes nested commands", async (done) => {
    const multipleInput = new Document({
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
      path: "stateCommand.test.js",
    });

    const multipleFinal = `
console.log("we are foo");
// let foo = defined;
// console.log(foo);
end
`;
    const parseResult = bluehawk.parse(multipleInput);
    expect(parseResult.source.path).toBe("stateCommand.test.js");
    const files = await bluehawk.process(parseResult);
    // wait what? Two snippets?
    // It's because the snippet lives outside of the states
    // There would only be one snippet publish if it was nested
    expect(Object.keys(files)).toStrictEqual([
      "stateCommand.test.js",
      "stateCommand.test.js#state.begin",
      "stateCommand.test.codeblock.foo.js#state.begin",
      "stateCommand.test.codeblock.foo.js",
      "stateCommand.test.js#state.final",
      "stateCommand.test.codeblock.foo.js#state.final",
    ]);

    expect(
      files["stateCommand.test.js#state.final"].source.text.toString()
    ).toBe(multipleFinal);
    done();
  });
});
