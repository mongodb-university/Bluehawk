import { strict as assert } from "assert";
import { IToken } from "chevrotain";
import { COMMAND_START_PATTERN, COMMAND_END_PATTERN } from "./lexer/tokens";

export function extractCommandNamesFromTokens(
  startToken: IToken,
  endToken: IToken
): [string, string] {
  const startPatternResult = COMMAND_START_PATTERN.exec(startToken.image);
  assert(startPatternResult !== null);
  const commandName = startPatternResult[1];
  assert(commandName !== null);
  const endPatternResult = COMMAND_END_PATTERN.exec(endToken.image);
  assert(endPatternResult !== null);
  const endCommandName = endPatternResult[1];
  assert(endCommandName !== null);
  return [commandName, endCommandName];
}
