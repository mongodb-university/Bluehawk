import { Bluehawk } from "../bluehawk";
import { Document } from "../Document";
import { StateCommand } from "./StateCommand";
import { RemoveCommand } from "./RemoveCommand";
import { SnippetCommand } from "./SnippetCommand";

describe("stateCommand", () => {
  const bluehawk = new Bluehawk();
  const singleInput = new Document({
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
    path: "stateCommand.test.ts",
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

  const nestedInput = new Document({
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
    path: "stateCommand.test.js",
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

  bluehawk.registerCommand("state", StateCommand);
  bluehawk.registerCommand("remove", RemoveCommand);
  bluehawk.registerCommand("snippet", SnippetCommand);

  it("processes nested commands", () => {
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
    const parseResult = bluehawk.parse(multipleInput);
    expect(parseResult.source.path).toBe("stateCommand.test.js");
    const files = bluehawk.process(parseResult);
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
  });
});
