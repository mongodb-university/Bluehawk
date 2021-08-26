import { Lexer, TokenType } from "chevrotain";
import { makeAttributeListMode } from "./makeAttributeListMode";
import { makeRootMode } from "./makeRootMode";
import {
  PopParser,
  Newline,
  Space,
  Text,
  AttributeListStart,
  Identifier,
  BlockCommentEnd,
} from "./tokens";
import { tokenCategoryFilter } from "./tokenCategoryFilter";


// Generates a Lexer for the given language comment patterns.
export function makeLexer(languageTokens: TokenType[]): Lexer {
  const modes = {
    RootMode: makeRootMode(languageTokens),
    // After a command start tag, there may be an attributes list or ID until the
   // end of line or a block comment end.
    CommandAttributesMode: [
      AttributeListStart,
      Identifier,
      ...tokenCategoryFilter(languageTokens, [BlockCommentEnd]),
      Space,
      { ...Newline, 
        POP_MODE: true },
    ],
    AttributeListMode: makeAttributeListMode(languageTokens),
    AltParserMode: [
      ...tokenCategoryFilter(languageTokens, [PopParser]),
      Newline,
      Space,
      Text,
    ],
  };
  return new Lexer({
    modes,
    defaultMode: "RootMode",
  });
}
