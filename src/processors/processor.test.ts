import { join } from "path";
import { Bluehawk } from "../bluehawk";
import { CommandNode } from "../parser/CommandNode";
import Processor, { Command, CommandConfig } from "./Processor";

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

  it("still returns even when no processors are registered", () => {
    const output = bluehawk.run(input);
    expect(Processor.process(output, bluehawk)).toEqual(input.text);
  });

  it("allows a processor to be registered and run", () => {
    const source = {
      text: `// :test-start:
// :test-end:
`,
      language: "ts",
      filePath: "/",
    };
    class TestCommand extends Command {
      constructor(cfg: CommandConfig) {
        super(cfg);
      }
      process(command: CommandNode) {
        return {
          range: {
            start: command.range.start.offset,
            end: command.range.end.offset,
          },
          result: "42",
        };
      }
    }
    const tp = new TestCommand({ commandName: "test" });
    const registerSpy = jest.spyOn(Processor, "registerCommand");
    Processor.registerCommand(tp);
    expect(registerSpy).toHaveBeenCalledTimes(1);

    const output = bluehawk.run(source);
    expect(Processor.process(output, bluehawk)).toEqual("42");
  });
  it("allows subscriptions and pushed events to listeners", () => {
    const spy = jest.fn();
    Processor.subscribe(spy);
    Processor.publish("foo");
    expect(spy).toHaveBeenCalledWith("foo");
  });
});
