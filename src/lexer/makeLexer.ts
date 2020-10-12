import { Lexer } from "chevrotain";
import { AttributeListMode } from "./AttributeListMode";
import { CommandAttributesMode } from "./CommandAttributesMode";
import { CommentPatterns } from "./CommentPatterns";
import { JsonMode } from "./JsonMode";
import { makeRootMode } from "./makeRootMode";

// Generates a Lexer for the given language comment patterns.
export function makeLexer(
  commentPatterns: CommentPatterns = {
    lineCommentPattern: /\/\//, // Standard C++-ish line comment --> //
    blockCommentStartPattern: /\/\*/, // Standard C-ish block comment start --> /*
    blockCommentEndPattern: /\*\\/, // Standard C-ish block comment end --> */
  }
): Lexer {
  return new Lexer({
    modes: {
      RootMode: makeRootMode(commentPatterns),
      CommandAttributesMode,
      AttributeListMode,
      JsonMode,
    },
    defaultMode: "RootMode",
  });
}
