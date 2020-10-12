import { createToken, TokenType } from "chevrotain";
import { CommentPatterns } from "./CommentPatterns";

export interface CommentTokens {
  LineComment: TokenType;
  BlockCommentStart: TokenType;
  BlockCommentEnd: TokenType;
}

export function makeCommentTokens({
  lineCommentPattern,
  blockCommentStartPattern,
  blockCommentEndPattern,
}: CommentPatterns): CommentTokens {
  return {
    LineComment: createToken({
      name: "LineComment",
      pattern: lineCommentPattern,
    }),
    BlockCommentStart: createToken({
      name: "BlockCommentStart",
      pattern: blockCommentStartPattern,
    }),
    BlockCommentEnd: createToken({
      name: "BlockCommentEnd",
      pattern: blockCommentEndPattern,
    }),
  };
}
