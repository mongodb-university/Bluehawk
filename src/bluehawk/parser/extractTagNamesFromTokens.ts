import { strict as assert } from "assert";
import { IToken } from "chevrotain";
import { COMMAND_START_PATTERN, COMMAND_END_PATTERN } from "./lexer/tokens";

export function extractTagNamesFromTokens(
  startToken: IToken,
  endToken: IToken
): [string, string] {
  const startPatternResult = COMMAND_START_PATTERN.exec(startToken.image);
  assert(startPatternResult !== null);
  assert(startPatternResult.length > 1);
  const tagName = startPatternResult[1];
  const endPatternResult = COMMAND_END_PATTERN.exec(endToken.image);
  assert(endPatternResult !== null);
  assert(endPatternResult.length > 1);
  const endTagName = endPatternResult[1];
  return [tagName, endTagName];
}
