import { join } from "path";
import { Bluehawk } from "../bluehawk";
import Processor from "./Processor";
import StateCommandProcessor from "./StateCommand";
import RemoveCommand from "./RemoveCommand";
import SnippetCommand from "./SnippetCommand";

describe("stateCommand", () => {
  const bluehawk = new Bluehawk();
  const singleInput = {
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
  };
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

  const nestedInput = {
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
    filePath: join(__dirname, "stateCommand.test.ts"),
  };
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
  const multipleInput = {
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
    filePath: join(__dirname, "stateCommand.test.ts"),
  };
  const multipleBegin = `
let foo = undefined;
console.log(foo);
console.log("we are foo");
end
`;
  const multipleFinal = `
console.log("we are foo");
let foo = defined;
console.log(foo);
end
`;
  const stateCP = new StateCommandProcessor({ commandName: "state" });
  Processor.registerCommand(stateCP);
  const removeCP = new RemoveCommand({ commandName: "remove" });
  Processor.registerCommand(removeCP);
  const snippetCP = new SnippetCommand({ commandName: "snippet" });
  Processor.registerCommand(snippetCP);

  it("processes only state", () => {
    const notifs = [];
    Processor.subscribe((event) => notifs.push(event));
    const parsed = bluehawk.run(singleInput);
    stateCP.findStates(parsed);
    stateCP.process(parsed, bluehawk);
    expect(notifs[0].event).toEqual("state");
    expect(notifs[0].state).toEqual("begin");
    expect(notifs[0].content).toEqual(singleBegin);
    expect(notifs[1].state).toEqual("final");
    expect(notifs[1].content).toEqual(singleEnd);
  });
  it("processes nested commands", () => {
    const notifs = [];
    Processor.subscribe((event) => notifs.push(event));
    const parsed = bluehawk.run(nestedInput);
    stateCP.findStates(parsed);
    stateCP.process(parsed, bluehawk);
    expect(notifs[0].event).toEqual("state");
    expect(notifs[0].state).toEqual("begin");
    expect(notifs[0].content).toEqual(nestedBegin);
    expect(notifs[1].state).toEqual("final");
    expect(notifs[1].content).toEqual(nestedFinal);
  });
  it("processes nested commands", () => {
    const notifs = [];
    Processor.subscribe((event) => notifs.push(event));
    const parsed = bluehawk.run(multipleInput);
    stateCP.findStates(parsed);
    stateCP.process(parsed, bluehawk);
    expect(notifs[0].event).toEqual("snippet");
    expect(notifs[1].event).toEqual("state");
    // wait what? Two snippets?
    // It's because the snippet lives outside of the states
    // There would only be one snippet publish if it was nested
    expect(notifs[2].event).toEqual("snippet");
    expect(notifs[3].event).toEqual("state");
    expect(notifs[1].state).toEqual("begin");
    expect(notifs[1].content).toEqual(multipleBegin);
    expect(notifs[3].state).toEqual("final");
    expect(notifs[3].content).toEqual(multipleFinal);
  });
});
