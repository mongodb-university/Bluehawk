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
      Space,
      ..._CommandAttributesPopTokens(languageTokens),
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

// Helper function for generating command attribute pop tokens
function _CommandAttributesPopTokens(languageTokens: TokenType[]): TokenType[] {
  let popTokens: TokenType[] = [{ ...Newline, POP_MODE: true }];
  // if block comments are defined, add them as pop tokens
  if (tokenCategoryFilter(languageTokens, [BlockCommentEnd]).length !== 0) {
    popTokens.push({
      ...tokenCategoryFilter(languageTokens, [BlockCommentEnd])[0],
      POP_MODE: true,
    });
  }
  return popTokens;
}
