import { TokenType } from "chevrotain";
import { CommentPatterns } from "./CommentPatterns";
import {
  Command,
  CommandEnd,
  CommandStart,
  Newline,
  Space,
  Text,
} from "./tokens";
import { makeCommentTokens } from "./makeCommentTokens";

// RootMode is the default parser and lexer mode.
export function makeRootMode(
  commentPatterns: CommentPatterns
): Array<TokenType> {
  // Keep comment tokens where the pattern is defined
  const commentTokens = Object.values(
    makeCommentTokens(commentPatterns)
  ).filter((token) => token.PATTERN !== undefined);

  // Order matters -- always CommandStart/End before Command
  return [
    CommandStart,
    CommandEnd,
    Command,
    ...commentTokens,
    Space,
    Newline,
    Text,
  ];
}
