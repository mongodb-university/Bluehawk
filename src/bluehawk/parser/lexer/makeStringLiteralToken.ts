import { createToken, TokenType } from "chevrotain";
import { StringLiteral } from "./tokens";

export function makeStringLiteralToken(
  pattern: RegExp,
  isMultiline: boolean
): TokenType {
  return createToken({
    name: "StringLiteral",
    label: `StringLiteral(${pattern.source})`,
    pattern,
    categories: [StringLiteral],
    line_breaks: isMultiline,
  });
}
