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
} from "./tokens";
import { tokenCategoryFilter } from "./tokenCategoryFilter";

// After a command start tag, there may be an attributes list or ID until the
// end of line.
const CommandAttributesMode = [
  AttributeListStart,
  Identifier,
  Space,
  { ...Newline, POP_MODE: true },
];

// Generates a Lexer for the given language comment patterns.
export function makeLexer(languageTokens: TokenType[]): Lexer {
  const modes = {
    RootMode: makeRootMode(languageTokens),
    CommandAttributesMode,
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
