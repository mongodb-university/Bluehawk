import { createToken, Lexer, TokenType } from "chevrotain";
import { makePayloadPattern } from "./makePayloadPattern";
import {
  makePushParserTokens,
  PushParserTokenConfiguration,
} from "./makePushParserTokens";
import { makeModeId } from "./modeId";
import { StringLiteral } from "./tokens";

export interface StringLiteralTokenConfiguration {
  // The end pattern, e.g. /"/y
  startPattern: RegExp;

  // The end pattern. If not included, clients should use the startPattern.
  endPattern?: RegExp;

  // The escaped end pattern (e.g. `\"`). If not included, escapes are not allowed.
  escapePattern?: RegExp;

  // Specifies whether the string literal can span multiple lines without
  // escaping.
  isMultiline: boolean;

  // If provided, enables interpolation (template literals).
  interpolation?: PushParserTokenConfiguration;
}

export interface StringLiteralTokenPayload
  extends StringLiteralTokenConfiguration {
  endToken: TokenType;
}

export function makeStringLiteralTokens(
  configuration: StringLiteralTokenConfiguration
): TokenType[] {
  // Each invocation of makeStringLiteralTokens() puts the tokens in their own
  // group. This allows the lexer to create a mode specifically for each group.
  const modeId = makeModeId();

  const { startPattern } = configuration;
  // Create the end token first so we can reference it later
  const endPattern = configuration.endPattern ?? startPattern;
  const endToken = createToken({
    name: `${modeId}StringLiteralEnd`,
    label: `StringLiteralEnd(${endPattern})`,
    categories: [StringLiteral.End],
    pattern: endPattern,
    line_breaks: false,
    pop_mode: true,
  });

  // Begin assembling the final set of tokens
  const tokens = [
    createToken({
      name: "StringLiteralStart",
      label: `StringLiteralStart(${startPattern})`,
      categories: [StringLiteral.Start],
      pattern: makePayloadPattern(
        startPattern,
        (): StringLiteralTokenPayload => ({
          ...configuration,
          endToken,
        })
      ),
      line_breaks: false,
      push_mode: modeId,
    }),
  ];

  const { interpolation, escapePattern } = configuration;

  // Add optional string interpolation tokens to make this a template literal
  if (interpolation) {
    makePushParserTokens({ ...interpolation, modeId }).forEach((token) =>
      tokens.push(token)
    );
  }

  // Add optional escape token
  if (escapePattern) {
    tokens.push(
      createToken({
        name: `${modeId}StringLiteralEscape`,
        label: `StringLiteralEscape(${escapePattern})`,
        categories: [StringLiteral.Escape],
        group: Lexer.SKIPPED,
        pattern: escapePattern,
        line_breaks: true, // could escape newline
      })
    );
  }
  // Make sure the escape token goes before the end token
  tokens.push(endToken);

  return tokens;
}
