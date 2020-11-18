import { makeBlockCommentTokens } from "../lexer/makeBlockCommentTokens";
import { makeLineCommentToken } from "../lexer/makeLineCommentToken";
import { makePushParserTokens } from "../lexer/makePushParserTokens";
import { makeCstVisitor } from "../parser/makeCstVisitor";
import { RootParser } from "../parser/RootParser";

const someSource = {
  language: "mock",
  filePath: "mock",
  text: "mock",
};
describe("multicomment", () => {
  const parser = new RootParser([
    ...makeBlockCommentTokens(/AA/y, /\/AA/),
    ...makeBlockCommentTokens(/BB/y, /\/BB/),
    ...makeBlockCommentTokens(/CC/y, /\/CC/),
  ]);

  it("accepts multiple block comment types", () => {
    const parseResult = parser.parse(`
AA
/AA
BB
/BB
CC
/CC
`);
    expect(parseResult.errors).toStrictEqual([]);
    for (let i = 1; i < 4; ++i) {
      expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Object.keys((parseResult.cst.children.chunk[i] as any).children)[0]
      ).toBe("blockComment");
    }
  });

  it("rejects mismatched block comment ends", () => {
    const parseResult = parser.parse(`AA /BB`);
    expect(parseResult.errors[0].message).toBe(
      "1:1(0) blockComment: After BlockCommentStart, expected BlockCommentEnd but found BlockCommentEnd"
    );
  });
});

describe("multilang", () => {
  const phpParser = new RootParser([
    ...makeBlockCommentTokens(/\/\*/y, /\*\//y),
    makeLineCommentToken(/\/\/|#/y),
  ]);
  const phpVisitor = makeCstVisitor(phpParser);
  const parser = new RootParser([
    ...makeBlockCommentTokens(/<!--/y, /-->/),
    ...makePushParserTokens({
      pushPattern: /<\?php/y,
      popPattern: /\?>/,
      includeTokens: false,
      getInnerVisitor: () => phpVisitor,
    }),
  ]);
  const visitor = makeCstVisitor(parser);

  it("parses without context switching", () => {
    const parseResult = parser.parse(`
<!-- This is HTML :block-commented-command: -->
// :command:
# :command2:
`);
    expect(parseResult.errors).toStrictEqual([]);
    const result = visitor.visit(parseResult.cst, someSource);
    expect(result.errors).toStrictEqual([]);
    expect(
      result.commands.map((command) => [command.commandName, command.inContext])
    ).toStrictEqual([
      ["block-commented-command", "blockComment"],
      ["command", "none"],
      ["command2", "none"],
    ]);
  });

  it("handles context switching", () => {
    const parseResult = parser.parse(`
<!-- This is HTML :block-commented-command: -->
// :command:
# :command2:
<?php
// This is PHP :line-commented-command:
# :line-commented-command2:
/* :block-commented-command2: */
<!-- :command3: -->
?>
<!-- This is HTML :block-commented-command3: -->
// :command4:
# :command5:
`);
    expect(parseResult.errors).toStrictEqual([]);
    const result = visitor.visit(parseResult.cst, someSource);
    expect(result.errors).toStrictEqual([]);
    expect(
      result.commands.map((command) => [command.commandName, command.inContext])
    ).toStrictEqual([
      ["block-commented-command", "blockComment"],
      ["command", "none"],
      ["command2", "none"],
      ["line-commented-command", "lineComment"],
      ["line-commented-command2", "lineComment"],
      ["block-commented-command2", "blockComment"],
      ["command3", "none"],
      ["block-commented-command3", "blockComment"],
      ["command4", "none"],
      ["command5", "none"],
    ]);
  });

  it("reports inner parser errors at the outer location", () => {
    const parseResult = parser.parse(`
<!-- This is HTML -->
<?php
/*
?>
`);
    expect(parseResult.errors).toStrictEqual([]);
    const result = visitor.visit(parseResult.cst, someSource);
    expect(result.errors[0].message).toContain(
      "blockComment: After Newline, expected BlockCommentEnd but found EOF"
    );
    expect(result.errors[0].location).toStrictEqual({
      line: 5,
      column: 1,
      offset: 31,
    });
  });

  it("handles matching push/pop parser patterns", () => {
    const markdownParser = new RootParser([
      ...makePushParserTokens({
        pushPattern: /```/y,
        popPattern: /```/,
        includeTokens: false,
        getInnerVisitor: () => phpVisitor,
      }),
    ]);
    const parseResult = markdownParser.parse(`
// :command:
\`\`\`
// :line-commented-command:
\`\`\`
:command2:
`);
    const visitor = makeCstVisitor(markdownParser);
    const result = visitor.visit(parseResult.cst, someSource);
    expect(result.errors).toStrictEqual([]);
    expect(
      result.commands.map((command) => [command.commandName, command.inContext])
    ).toStrictEqual([
      ["command", "none"],
      ["line-commented-command", "lineComment"],
      ["command2", "none"],
    ]);
  });

  it("rejects recursive matching dummyPush/pop parser patterns", () => {
    expect(() =>
      makePushParserTokens({
        pushPattern: /```/y,
        dummyPushPattern: /```/y,
        popPattern: /```/,
        includeTokens: false,
        getInnerVisitor: () => phpVisitor,
      })
    ).toThrowError();
  });
});
