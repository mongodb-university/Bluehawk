import { createToken, TokenType } from "chevrotain";
import { PayloadQuery, makePayloadPattern } from "./makePayloadPattern";
import { PopParser, PushParser } from "./tokens";

export interface PushParserTokenConfiguration {
  parserId: string;
  includePushTokenInSubstring: boolean;
  includePopTokenInSubstring: boolean;
}

export interface PushParserPayload {
  fullText: string;
  parserId: string;
  includePushTokenInSubstring: boolean;
  includePopTokenInSubstring: boolean;
  endToken: TokenType;
}

export function makePushParserTokens(
  pushPattern: RegExp,
  popPattern: RegExp,
  configuration: PushParserTokenConfiguration
): [TokenType, TokenType] {
  const tokens: [TokenType, TokenType] = [
    createToken({
      name: "PushParser",
      label: `PushParser(${pushPattern})`,
      categories: [PushParser],
      pattern: makePayloadPattern(
        pushPattern,
        ({ text }: PayloadQuery): PushParserPayload => ({
          ...configuration,
          fullText: text,
          endToken: tokens[1],
        })
      ),
      push_mode: "AltParserMode",
      line_breaks: false,
    }),
    createToken({
      name: "PopParser",
      label: `PopParser(${popPattern})`,
      categories: [PopParser],
      pattern: popPattern,
      pop_mode: true,
      line_breaks: false,
    }),
  ];
  return tokens;
}
