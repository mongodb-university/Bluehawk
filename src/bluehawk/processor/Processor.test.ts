import { Bluehawk } from "../bluehawk";
import { Command } from "../commands/Command";
import { removeMetaRange } from "../commands/removeMetaRange";
import { Document } from "../Document";
import { ParseResult } from "../parser/ParseResult";

describe("processor", () => {
  const bluehawk = new Bluehawk();

  const AppendMessageAfterDelayCommand: Command = {
    rules: [],
    process: (request): Promise<void> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const { commandNode, parseResult } = request;
          const { source } = parseResult;
          removeMetaRange(source.text, commandNode);
          source.text.appendLeft(
            commandNode.range.end.offset,
            "async command executed"
          );
          resolve();
        }, 10);
      });
    },
  };

  bluehawk.registerCommand(
    "append-message-after-delay",
    AppendMessageAfterDelayCommand
  );

  it("ignores unknown commands", async (done) => {
    // NOTE: This is not necessarily the desired behavior, but it is the current
    // behavior.
    const source = new Document({
      text: `:unknown-command:
`,
      language: "javascript",
      path: "test.js",
    });

    const parseResult = bluehawk.parse(source);
    expect(parseResult.commandNodes[0].commandName).toBe("unknown-command");
    const files = await bluehawk.process(parseResult);
    expect(files["test.js"].source.text.toString()).toBe(`:unknown-command:
`);
    done();
  });

  it("supports async commands", async (done) => {
    const source = new Document({
      text: `// :append-message-after-delay-start:
a
b
c
// :append-message-after-delay-end:
`,
      language: "javascript",
      path: "test.js",
    });

    const parseResult = bluehawk.parse(source);
    const files = await bluehawk.process(parseResult);
    expect(files["test.js"].source.text.toString()).toBe(`a
b
c
async command executed`);
    done();
  });

  it("supports async listeners", async (done) => {
    const source = new Document({
      text: `abc\n`,
      language: "javascript",
      path: "test.js",
    });

    const bluehawk = new Bluehawk();
    const parseResult = bluehawk.parse(source);

    let didCallListener = 0;
    let didWaitForListener = 0;
    for (let i = 0; i < 10; ++i) {
      const listener = (result: ParseResult) => {
        didCallListener += 1;
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            didWaitForListener += 1;
            resolve();
          }, 10 - i);
        });
      };
      bluehawk.subscribe(listener);
    }
    expect(didCallListener).toBe(0);
    expect(didWaitForListener).toBe(0);
    await bluehawk.process(parseResult);

    // Processor fires off files to listeners and doesn't wait for the result,
    // so we must set a timeout here
    setTimeout(() => {
      expect(didCallListener).toBe(10);
      expect(didWaitForListener).toBe(10);
      done();
    }, 11);
  });

  it("does not stop on misbehaving listeners", async (done) => {
    const source = new Document({
      text: `abc\n`,
      language: "javascript",
      path: "test.js",
    });

    const bluehawk = new Bluehawk();
    const parseResult = bluehawk.parse(source);

    let didCallListener = 0;
    let didWaitForListener = 0;
    for (let i = 0; i < 10; ++i) {
      const listener = (result: ParseResult) => {
        if (i === 5) {
          // Naughty listener!
          throw new Error("I'm misbehavin'!");
        }
        didCallListener += 1;
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            didWaitForListener += 1;
            resolve();
          }, 10 - i);
        });
      };
      bluehawk.subscribe(listener);
    }
    expect(didCallListener).toBe(0);
    expect(didWaitForListener).toBe(0);
    const originalError = console.error;
    const errors: string[] = [];
    console.error = (s: string) => {
      errors.push(s);
    };
    await bluehawk.process(parseResult);
    console.error = originalError;
    expect(errors).toStrictEqual([
      `When processing result 'test.js', a listener failed with the following error: Error: I'm misbehavin'!

This is probably not a bug in the Bluehawk library itself. Please check with the listener implementer.`,
    ]);

    // Processor fires off files to listeners and doesn't wait for the result,
    // so we must set a timeout here
    setTimeout(() => {
      expect(didCallListener).toBe(9);
      expect(didWaitForListener).toBe(9);
      done();
    }, 11);
  });
});
