import { Bluehawk } from "../bluehawk";
import {
  IdRequiredAttributes,
  IdRequiredAttributesSchema,
  makeBlockTag,
  makeLineTag,
} from "../tags/Tag";
import { Document } from "../Document";
import { ParseResult } from "../parser/ParseResult";

describe("processor", () => {
  const bluehawk = new Bluehawk();
  bluehawk.addLanguage(["js"], {
    languageId: "javascript",
    blockComments: [[/\/\*/, /\*\//]],
    lineComments: [/\/\/ ?/],
  });

  it("ignores unknown tags", async (done) => {
    // NOTE: This is not necessarily the desired behavior, but it is the current
    // behavior.
    const source = new Document({
      text: `:unknown-tag:
`,
      path: "test.js",
    });

    const parseResult = bluehawk.parse(source);
    expect(parseResult.tagNodes[0].tagName).toBe("unknown-tag");
    const files = await bluehawk.process(parseResult);
    expect(files["test.js"].document.text.toString()).toBe(`:unknown-tag:
`);
    done();
  });

  it("supports async listeners", async (done) => {
    const source = new Document({
      text: `abc\n`,
      path: "test.js",
    });

    const bluehawk = new Bluehawk();
    const parseResult = bluehawk.parse(source);

    let didCallListener = 0;
    let didWaitForListener = 0;
    for (let i = 0; i < 10; ++i) {
      const listener = () => {
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
      path: "test.js",
    });

    const bluehawk = new Bluehawk();
    const parseResult = bluehawk.parse(source);

    let didCallListener = 0;
    let didWaitForListener = 0;
    for (let i = 0; i < 10; ++i) {
      const listener = () => {
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

  it("passes correct tag node type to ", async (done) => {
    const bluehawk = new Bluehawk();
    bluehawk.addLanguage(["js"], {
      languageId: "javascript",
      blockComments: [[/\/\*/, /\*\//]],
      lineComments: [/\/\/ ?/],
    });

    const state = {
      calledLineTagProcess: false,
      calledBlockTagProcess: false,
    };
    const LineTag = makeLineTag({
      name: "line-tag",
      process({ tagNode }) {
        expect(tagNode.attributes).toBeUndefined();
        expect(tagNode.children).toBeUndefined();
        expect(tagNode.contentRange).toBeUndefined();
        expect(tagNode.tagName).toBe("line-tag");
        expect(tagNode.id).toBeUndefined();
        expect(tagNode.type).toBe("line");
        state.calledLineTagProcess = true;
      },
    });

    const BlockTag = makeBlockTag<IdRequiredAttributes>({
      name: "block-tag",
      attributesSchema: IdRequiredAttributesSchema,
      process({ tagNode }) {
        expect(tagNode.attributes).toBeDefined();
        expect(tagNode.children).toBeDefined();
        expect(tagNode.contentRange).toBeDefined();
        expect(tagNode.id).toBe("test");
        expect(tagNode.type).toBe("block");
        state.calledBlockTagProcess = true;
      },
    });

    bluehawk.registerTag(LineTag);
    bluehawk.registerTag(BlockTag);

    await (async () => {
      const result = bluehawk.parse(
        new Document({
          text: `:line-tag-start:
:line-tag-end:
:block-tag:
`,
          path: "test.js",
        })
      );
      // Validate that line-tag and block-tag cannot be used in the
      // opposite mode
      expect(result.errors.map((error) => error.message)).toStrictEqual([
        "'line-tag' cannot be used in block mode (i.e. with -start and -end)",
        "'block-tag' cannot be used in single line mode (i.e. without -start and -end around a block)",
      ]);

      // Tag nodes exist anyway? (TODO: should they be removed if they do
      // not pass the validator?)
      expect(result.tagNodes.length).toBe(2);
    })();
    const result = bluehawk.parse(
      new Document({
        text: `:line-tag:\n`,
        path: "test.js",
      })
    );
    expect(result.errors).toStrictEqual([]);
    await bluehawk.process(result);
    expect(state.calledLineTagProcess).toBe(true);
    done();
  });
});
