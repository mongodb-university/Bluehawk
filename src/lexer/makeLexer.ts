import { Lexer } from "chevrotain";
import { CommandAttributesMode } from "./CommandAttributesMode";
import { CommentPatterns } from "./CommentPatterns";
import { makeAttributeListMode } from "./makeAttributeListMode";
import { makeRootMode } from "./makeRootMode";

// Generates a Lexer for the given language comment patterns.
export function makeLexer(
  commentPatterns: CommentPatterns = {
    lineCommentPattern: /\/\//, // Standard C++-ish line comment --> //
    blockCommentStartPattern: /\/\*/, // Standard C-ish block comment start --> /*
    blockCommentEndPattern: /\*\//, // Standard C-ish block comment end --> */
    canNestBlockComments: true,
  }
): Lexer {
  return new Lexer({
    modes: {
      RootMode: makeRootMode(commentPatterns),
      CommandAttributesMode,
      AttributeListMode: makeAttributeListMode(commentPatterns),
    },
    defaultMode: "RootMode",
  });
}
