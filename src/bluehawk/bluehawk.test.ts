import { idIsUnique } from "./processor/validator";
import { Bluehawk } from "./bluehawk";
import { Document } from "./Document";
import {
  IdRequiredAttributes,
  IdRequiredAttributesSchema,
  makeBlockCommand,
} from "./commands";

describe("bluehawk", () => {
  const bluehawk = new Bluehawk();
  bluehawk.registerCommand(
    "code-block",
    makeBlockCommand<IdRequiredAttributes>({
      attributesSchema: IdRequiredAttributesSchema,
      process(request) {
        return;
      },
      rules: [idIsUnique],
    })
  );

  it("handles lexing, parsing, visiting, and validating", () => {
    const input = new Document({
      text: `
    this is ignored
    :some-command-start:
    this is in the command
    :some-command-end:
`,
      language: "testlanguage",
      path: "testPath",
    });
    const output = bluehawk.parse(input);
    expect(output.errors).toStrictEqual([]);
  });

  it("contains lexing errors", () => {
    const input = new Document({
      text: `
    :some-command-start: '
    this is ignored
    :some-command-end:
    `,
      language: "testlanguage",
      path: "testPath",
    });
    const output = bluehawk.parse(input);
    expect(output.errors.length).toBe(1);
    expect(output.errors[0]).toStrictEqual({
      component: "lexer",
      location: {
        column: 26,
        line: 2,
        offset: 26,
      },
      message:
        "unexpected character: ->'<- at offset: 26, skipped 1 characters.",
    });
  });

  it("contains parsing errors", () => {
    const input = new Document({
      text: `
    this is ignored
    :some-command-start:
    this is in the command
    :some-command-start:
`,
      language: "testlanguage",
      path: "testPath",
    });
    const output = bluehawk.parse(input);
    expect(output.errors.length).toBe(1);
    expect(output.errors[0]).toStrictEqual({
      component: "parser",
      location: {
        column: 25,
        line: 5,
        offset: 97,
      },
      message:
        "5:25(97) blockCommand: After Newline, expected CommandEnd but found EOF",
    });
  });

  it("contains visiting errors", () => {
    // TODO: come up with a decent visiting error
    const input = new Document({
      text: `
    this is ignored
    :some-command-start:
    this is in the command
    :some-command-end:
`,
      language: "testlanguage",
      path: "testPath",
    });
    const output = bluehawk.parse(input);
    expect(output.errors.length).toBe(0);
    expect(output.errors[0]).toStrictEqual(undefined);
  });

  it("contains validating errors", () => {
    const input = new Document({
      text: `
    this is ignored
    :code-block-start:
    this is in the command
    :code-block-end:
`,
      language: "testlanguage",
      path: "testPath",
    });
    const output = bluehawk.parse(input);
    expect(output.errors.length).toBe(1);
    expect(output.errors[0]).toStrictEqual({
      component: "validator",
      location: {
        column: 5,
        line: 3,
        offset: 25,
      },
      message: "attribute list for 'code-block' command should be object",
    });
  });
});
