import { TokenType } from "chevrotain";
import {
  AttributeListEnd,
  AttributeListStart,
  BlockCommentEnd,
  BlockCommentStart,
  JsonStringLiteral,
  LineComment,
  Newline,
  Space,
  Text,
} from "./tokens";
import { tokenCategoryFilter } from "./tokenCategoryFilter";

/*
Bluehawk uses AttributeListMode to parse the attribute list of a command:

    :code-block-start: {
      "id": "some-id",
      "attribute1": 1
    }

*/
// Attribute lists are basically JSON objects that allow comments.
export function makeAttributeListMode(
  languageTokens: TokenType[]
): TokenType[] {
  const commentTokens = tokenCategoryFilter(languageTokens, [
    BlockCommentStart,
    BlockCommentEnd,
    LineComment,
  ]);
  return [
    AttributeListStart,
    AttributeListEnd,
    JsonStringLiteral,
    ...commentTokens, // Attribute list JSON must be able to exist in commented lines
    Newline,
    Space,
    Text,
  ];
}
