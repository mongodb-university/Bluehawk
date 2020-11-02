import { TokenType } from "chevrotain";
import { tokenCategoryFilter } from "./tokenCategoryFilter";
import {
  BlockCommentEnd,
  BlockCommentStart,
  Command,
  CommandEnd,
  CommandStart,
  LineComment,
  Newline,
  PopParser,
  PushParser,
  Space,
  StringLiteral,
  Text,
} from "./tokens";

// RootMode is the default parser and lexer mode for a given language.
export function makeRootMode(languageTokens: TokenType[]): Array<TokenType> {
  return [
    CommandStart,
    CommandEnd,
    Command,
    ...tokenCategoryFilter(languageTokens, [
      BlockCommentStart,
      BlockCommentEnd,
      LineComment,
      PushParser,
      StringLiteral.Start,
    ]),
    Space,
    Newline,
    Text,

    // "Abstract" tokens
    PushParser,
    PopParser,
    LineComment,
    BlockCommentStart,
    BlockCommentEnd,
    ...Object.values(StringLiteral),
  ];
}
