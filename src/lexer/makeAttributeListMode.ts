import { TokenType } from "chevrotain";
import { CommentPatterns } from "./CommentPatterns";
import { makeCommentTokens } from "./makeCommentTokens";
import {
  AttributeListEnd,
  AttributeListStart,
  JsonStringLiteral,
  Newline,
  Space,
  Text,
} from "./tokens";

/*
Bluehawk uses AttributeListMode to parse the attribute list of a command:

    :code-block-start: {
      "id": "some-id",
      "attribute1": 1
    }

*/
// Attribute lists are basically JSON objects that allow comments.
export function makeAttributeListMode(
  commentPatterns: CommentPatterns
): TokenType[] {
  const commentTokens = Object.values(
    makeCommentTokens(commentPatterns)
  ).filter((token: TokenType) => token.PATTERN !== undefined);
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
