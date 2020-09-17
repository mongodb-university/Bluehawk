const {
  getCodeBlocks,
  getMinIndentation,
  deindentLines,
} = require("../getCodeBlocks");
const { expect, assert } = require("chai");

describe("getMinIndentation", () => {
  it("should return a number", () => {
    expect(getMinIndentation([])).to.equal(0);
  });

  it("should return the lowest indentation", () => {
    expect(getMinIndentation([" a"])).to.equal(1);
    expect(getMinIndentation(["  a"])).to.equal(2);
    expect(getMinIndentation(["   a"])).to.equal(3);
    expect(getMinIndentation(["    a"])).to.equal(4);
    expect(getMinIndentation(["     a"])).to.equal(5);
    expect(getMinIndentation(["\t\ta"])).to.equal(2);
  });

  it("should ignore blank and whitespace-only lines", () => {
    const result = getMinIndentation(["  ", "", "    a", "\t"]);
    expect(result).to.equal(4);
  });

  it("should pick the least indented intentation", () => {
    const result = getMinIndentation(
      `
      6
    4
  2

        8
      6
\t\t\t
`.split("\n")
    );
    expect(result).to.equal(2);
  });
});

describe("deindent", () => {
  it("should return an array", () => {
    expect(deindentLines([], 0)).to.deep.equal([]);
  });

  it("should deindent lines by an amount", () => {
    expect(deindentLines(["chocolate", "ack"], 2)).to.deep.equal([
      "ocolate",
      "k",
    ]);
  });

  it("should work with getMinIndentation", () => {
    const lines = `
    deindented by 4
\t\t\t\t\t
    even the blank lines
`.split("\n");
    const indentation = getMinIndentation(lines);
    expect(deindentLines(lines, indentation)).to.deep.equal(
      `
deindented by 4
\t
even the blank lines
`.split("\n")
    );
  });
});

describe("getCodeBlocks", () => {
  it("should return an array", () => {
    const result = getCodeBlocks({
      input: `
This is a bluehawk source file.
It has no markup.
`.split("\n"),
      emitCodeBlock: () => {
        assert(false, "unexpected code block emit");
      },
    });
    expect(result).to.deep.equal([]);
  });

  it("should emit code blocks", () => {
    const blocks = [];
    const result = getCodeBlocks({
      input: `
:code-block-start: one
hello world!
how are you?
:code-block-end:
`.split("\n"),
      emitCodeBlock: (block) => blocks.push(block),
    });
    expect(result).to.deep.equal([
      {
        finalCode: ["hello world!", "how are you?"],
        id: "one",
        props: [],
        startCode: ["hello world!", "how are you?"],
        range: [
          {
            line: 1,
            column: 0,
          },
          { line: 4, column: 17 },
        ],
      },
    ]);
    expect(blocks).to.deep.equal([
      {
        id: "one",
        source: ["hello world!", "how are you?"],
        stage: "start",
      },
      {
        id: "one",
        source: ["hello world!", "how are you?"],
        stage: "final",
      },
    ]);
  });

  it("should emit multiple code blocks", () => {
    const blocks = [];
    const result = getCodeBlocks({
      input: `
:code-block-start: one
hello world!
how are you?
:code-block-end:
nothing to see here
:code-block-start: two
the quick brown fox...
...jumped over the lazy dog
:code-block-end:
`.split("\n"),
      emitCodeBlock: (block) => blocks.push(block),
    });
    expect(result).to.deep.equal([
      {
        finalCode: ["hello world!", "how are you?"],
        id: "one",
        props: [],
        startCode: ["hello world!", "how are you?"],
        range: [
          { line: 1, column: 0 },
          { line: 4, column: 17 },
        ],
      },
      {
        finalCode: ["the quick brown fox...", "...jumped over the lazy dog"],
        id: "two",
        props: [],
        startCode: ["the quick brown fox...", "...jumped over the lazy dog"],
        range: [
          { line: 6, column: 0 },
          { line: 9, column: 17 },
        ],
      },
    ]);
    expect(blocks).to.deep.equal([
      {
        id: "one",
        source: ["hello world!", "how are you?"],
        stage: "start",
      },
      {
        id: "one",
        source: ["hello world!", "how are you?"],
        stage: "final",
      },
      {
        id: "two",
        source: ["the quick brown fox...", "...jumped over the lazy dog"],
        stage: "start",
      },
      {
        id: "two",
        source: ["the quick brown fox...", "...jumped over the lazy dog"],
        stage: "final",
      },
    ]);
  });

  it("should handle hide and replace-with", () => {
    const blocks = [];
    const result = getCodeBlocks({
      input: `
:code-block-start: one
this is everywhere
:hide-start:
this is in final
:replace-with:
this is in start
:hide-end:
this is also everywhere
:hide-start:
this is also in final
:replace-with:
this is also in start
:hide-end:
finally, one last everywhere
:code-block-end:
`.split("\n"),
      emitCodeBlock: (block) => blocks.push(block),
    });
    expect(result).to.deep.equal([
      {
        finalCode: [
          "this is everywhere",
          "this is in final",
          "this is also everywhere",
          "this is also in final",
          "finally, one last everywhere",
        ],
        id: "one",
        props: [],
        startCode: [
          "this is everywhere",
          "this is in start",
          "this is also everywhere",
          "this is also in start",
          "finally, one last everywhere",
        ],
        range: [
          {
            line: 1,
            column: 0,
          },
          { line: 15, column: 17 },
        ],
      },
    ]);
    expect(blocks).to.deep.equal([
      {
        id: "one",
        source: [
          "this is everywhere",
          "this is in start",
          "this is also everywhere",
          "this is also in start",
          "finally, one last everywhere",
        ],
        stage: "start",
      },
      {
        id: "one",
        source: [
          "this is everywhere",
          "this is in final",
          "this is also everywhere",
          "this is also in final",
          "finally, one last everywhere",
        ],
        stage: "final",
      },
    ]);
  });

  it("should handle props", () => {
    const blocks = [];
    const result = getCodeBlocks({
      input: `
:code-block-start: {
  "id": "one",
  "number": 1e-10,
  "bool": false,
  "null": null,
  "string": "some string",
  "array": [1.23, -2, 3]
}
hello, world!
:code-block-end:
`.split("\n"),
      emitCodeBlock: (block) => blocks.push(block),
    });
    expect(result).to.deep.equal([
      {
        finalCode: ["hello, world!"],
        id: "one",
        props: {
          bool: false,
          id: "one",
          null: null,
          number: 1e-10,
          string: "some string",
          array: [1.23, -2, 3],
        },
        startCode: ["hello, world!"],
        range: [
          { line: 1, column: 0 },
          { line: 10, column: 17 },
        ],
      },
    ]);

    expect(blocks).to.deep.equal([
      {
        id: "one",
        source: ["hello, world!"],
        stage: "start",
      },
      {
        id: "one",
        source: ["hello, world!"],
        stage: "final",
      },
    ]);
  });

  it("should fail on unclosed code-block", () => {
    expect(() => {
      getCodeBlocks({
        input: `
:code-block-start: a
`.split("\n"),
        emitCodeBlock: () => {},
      });
    }).to.throw("I expected a ':code-block-end:' but didn't find one.");
  });

  it("should deindent code example lines", () => {
    const source = `
          // :code-block-start: deindent-me
          this should be flush with the left column
          // :hide-start:
          this should be flush with the left column in final
          // :replace-with:
          this should be flush with the left column in start
          // :hide-end:
          // :code-block-end:`;
    const blocks = [];
    const result = getCodeBlocks({
      input: source.split("\n"),
      emitCodeBlock: (block) => blocks.push(block),
    });
    expect(result).to.deep.equal([
      {
        finalCode: `          this should be flush with the left column
          this should be flush with the left column in final`.split("\n"),
        id: "deindent-me",
        props: [],
        startCode: `          this should be flush with the left column
          this should be flush with the left column in start`.split("\n"),
        range: [
          { line: 1, column: 13 },
          { line: 8, column: 30 },
        ],
      },
    ]);
    expect(blocks).to.deep.equal([
      {
        id: "deindent-me",
        source: `this should be flush with the left column
this should be flush with the left column in start`.split("\n"),
        stage: "start",
      },
      {
        id: "deindent-me",
        source: `this should be flush with the left column
this should be flush with the left column in final`.split("\n"),
        stage: "final",
      },
    ]);
  });
});
