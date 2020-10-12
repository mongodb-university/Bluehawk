import { createToken, TokenType } from "chevrotain";
import { CommentPatterns } from "./CommentPatterns";
import { Newline, Space, Text } from "../tokens";

// RootMode is the default parser and lexer mode.
export function makeRootMode({
  lineCommentPattern,
  blockCommentStartPattern,
  blockCommentEndPattern,
}: CommentPatterns): Array<TokenType> {
  // Keep comment tokens when the pattern is defined
  const commentTokens = [
    createToken({ name: "LineComment", pattern: lineCommentPattern }),
    createToken({
      name: "BlockCommentStart",
      pattern: blockCommentStartPattern,
    }),
    createToken({ name: "BlockCommentEnd", pattern: blockCommentEndPattern }),
  ].filter((token) => token.PATTERN !== undefined);

  return [
    createToken({
      name: "CommandStart",
      pattern: /:[a-z-]+-start:/,
      push_mode: "CommandAttributesMode",
    }),
    createToken({
      name: "CommandEnd",
      pattern: /:[a-z-]+-end:/,
    }),
    createToken({
      name: "Command",
      pattern: /:[a-z-]+:/,
    }),
    ...commentTokens,
    Space,
    Newline,
    Text,
  ];
}
