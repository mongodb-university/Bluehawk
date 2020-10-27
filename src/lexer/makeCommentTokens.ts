import { createToken, TokenType } from "chevrotain";
import { CommentPatterns } from "./CommentPatterns";

const tokenCache = {
  lineCommentPatterns: new Map<string, TokenType>(),
  blockCommentStartPatterns: new Map<string, TokenType>(),
  blockCommentEndPatterns: new Map<string, TokenType>(),
};

// MUST reuse the same token instance between lexer and parser,
// or else identical lexed tokens won't be interpreted correctly by the parser.
function cachedToken(
  name: string,
  pattern: RegExp | undefined,
  cache: Map<string, TokenType>
): TokenType {
  const key = pattern?.toString() ?? "";
  if (cache.has(key)) {
    return cache.get(key);
  }
  const token = createToken({
    name,
    pattern,
  });
  cache.set(key, token);
  return token;
}

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
    LineComment: cachedToken(
      "LineComment",
      lineCommentPattern,
      tokenCache.lineCommentPatterns
    ),
    BlockCommentStart: cachedToken(
      "BlockCommentStart",
      blockCommentStartPattern,
      tokenCache.blockCommentStartPatterns
    ),
    BlockCommentEnd: cachedToken(
      "BlockCommentEnd",
      blockCommentEndPattern,
      tokenCache.blockCommentEndPatterns
    ),
  };
}
