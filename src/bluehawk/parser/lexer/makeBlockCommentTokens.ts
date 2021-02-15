import { createToken, TokenType } from "chevrotain";
import { makePayloadPattern } from "./makePayloadPattern";
import { BlockCommentStart, BlockCommentEnd } from "./tokens";

export interface BlockCommentTokenConfiguration {
  canNest: boolean;
}

export function makeBlockCommentTokens(
  startPattern: RegExp,
  endPattern: RegExp,
  configuration?: BlockCommentTokenConfiguration
): [TokenType, TokenType] {
  const tokens: [TokenType, TokenType] = [
    createToken({
      name: "BlockCommentStart",
      label: `BlockCommentStart(${startPattern.source})`,
      categories: [BlockCommentStart],
      pattern: makePayloadPattern(startPattern, () => ({
        ...(configuration ?? {}),
        endToken: tokens[1],
      })),
      line_breaks: false,
    }),
    createToken({
      name: "BlockCommentEnd",
      label: `BlockCommentEnd(${endPattern.source})`,
      categories: [BlockCommentEnd],
      pattern: endPattern,
      line_breaks: false,
    }),
  ];
  return tokens;
}
