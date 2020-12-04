import { join } from "path";
import { Bluehawk } from "../bluehawk";
import { CommandNode } from "../parser/CommandNode";
import Processor, { ParseCommand, CommandConfig } from "./Processor";

describe("processor", () => {
  const bluehawk = new Bluehawk();
  const input = {
    text: `
// :foo-start: fooBar
// :foo-end:
`,
    language: "javascript",
    filePath: join(__dirname, "commandProcessor.test.ts"),
  };
  it("allows subscriptions and pushed events to listeners", () => {
    const spy = jest.fn();
    Processor.subscribe(spy);
    Processor.publish("foo");
    expect(spy).toHaveBeenCalledWith("foo");
  });
});
