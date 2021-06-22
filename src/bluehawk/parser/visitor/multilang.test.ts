import { Document } from "../../Document";
import { makeBlockCommentTokens } from "../lexer/makeBlockCommentTokens";
import { makeLineCommentToken } from "../lexer/makeLineCommentToken";
import { makePushParserTokens } from "../lexer/makePushParserTokens";
import { makeCstVisitor, IVisitor } from "./makeCstVisitor";
import { RootParser } from "../RootParser";

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
      const kids = parseResult.cst?.children;
      expect(kids).toBeDefined();
      expect(kids?.chunk).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const chunk = kids?.chunk && (kids?.chunk[i] as any);
      expect(Object.keys(chunk.children)[0]).toBe("blockComment");
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
  const someSource = new Document({
    path: "mock",
    text: "mock",
  });
  const parser = new RootParser([
    ...makeBlockCommentTokens(/<!--/y, /-->/),
    ...makePushParserTokens(/<\?php/y, /\?>/, {
      includePopTokenInSubstring: false,
      includePushTokenInSubstring: false,
      parserId: "php",
    }),
  ]);

  const visitors: { [id: string]: IVisitor } = {};
  const getParser = (parserId: string): IVisitor => {
    return visitors[parserId];
  };

  const phpParser = new RootParser([
    ...makeBlockCommentTokens(/\/\*/y, /\*\//y),
    makeLineCommentToken(/\/\/|#/y),
  ]);
  visitors["php"] = makeCstVisitor(phpParser, getParser);
  const visitor = makeCstVisitor(parser, getParser);

  it("parses without context switching", () => {
    const parseResult = parser.parse(`
<!-- This is HTML :block-commented-command: -->
// :command:
# :command2:
`);
    expect(parseResult.errors).toStrictEqual([]);
    expect(parseResult.cst).toBeDefined();
    if (parseResult.cst === undefined) {
      return;
    }
    const result = visitor.visit(parseResult.cst, someSource);
    expect(result.errors).toStrictEqual([]);
    expect(
      result.commandNodes.map((command) => [
        command.commandName,
        command.inContext,
      ])
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
    expect(parseResult.cst).toBeDefined();
    if (parseResult.cst === undefined) {
      return;
    }
    const result = visitor.visit(parseResult.cst, someSource);
    expect(result.errors).toStrictEqual([]);
    expect(
      result.commandNodes.map((command) => [
        command.commandName,
        command.inContext,
      ])
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
    expect(parseResult.cst).toBeDefined();
    if (parseResult.cst === undefined) {
      return;
    }
    const result = visitor.visit(parseResult.cst, someSource);
    expect(result.errors[0].message).toContain(
      "blockComment: After Newline, expected BlockCommentEnd but found EOF"
    );
    expect(result.errors[0].location).toStrictEqual({
      line: 5,
      column: 1,
      offset: 31,
    });
    expect(result.errors[0].message).toBe(
      "2:3(4) blockComment: After Newline, expected BlockCommentEnd but found EOF"
    );
  });

  it("handles matching push/pop parser patterns", () => {
    const markdownParser = new RootParser([
      ...makePushParserTokens(/```/y, /```/, {
        includePopTokenInSubstring: false,
        includePushTokenInSubstring: false,
        parserId: "php", // let's just say it's php so we can reuse the outer visitor
      }),
    ]);
    const parseResult = markdownParser.parse(`
// :command:
\`\`\`
// :line-commented-command:
\`\`\`
:command2:
`);
    const visitor = makeCstVisitor(markdownParser, getParser);
    expect(parseResult.cst).toBeDefined();
    if (parseResult.cst === undefined) {
      return;
    }
    const result = visitor.visit(parseResult.cst, someSource);
    expect(result.errors).toStrictEqual([]);
    expect(
      result.commandNodes.map((command) => [
        command.commandName,
        command.inContext,
      ])
    ).toStrictEqual([
      ["command", "none"],
      ["line-commented-command", "lineComment"],
      ["command2", "none"],
    ]);
  });
});
