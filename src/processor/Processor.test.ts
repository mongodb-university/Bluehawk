import { Bluehawk } from "../bluehawk";
import { removeMetaRange } from "../commands/removeMetaRange";
import { Document } from "../Document";

describe("processor", () => {
  const bluehawk = new Bluehawk();

  bluehawk.registerCommand("append-message-after-delay", {
    rules: [],
    process: (request): Promise<void> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const { command, parseResult } = request;
          const { source } = parseResult;
          removeMetaRange(source.text, command);
          source.text.appendLeft(
            command.range.end.offset,
            "async command executed"
          );
          resolve();
        }, 50);
      });
    },
  });

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
});
