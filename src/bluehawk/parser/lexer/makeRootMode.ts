import { TokenType } from "chevrotain";
import { tokenCategoryFilter } from "./tokenCategoryFilter";
import {
  BlockCommentEnd,
  BlockCommentStart,
  Tag,
  TagEnd,
  TagStart,
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
    TagStart,
    TagEnd,
    Tag,
    ...tokenCategoryFilter(languageTokens, [
      BlockCommentStart,
      BlockCommentEnd,
      LineComment,
      PushParser,
      StringLiteral,
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
    StringLiteral,
  ];
}
