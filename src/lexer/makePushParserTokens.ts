import { createToken, TokenType } from "chevrotain";
import { IVisitor } from "../parser/makeCstVisitor";
import { PayloadQuery, makePayloadPattern } from "./makePayloadPattern";
import { makeModeId } from "./modeId";
import { DummyPushParser, PopParser, PushParser } from "./tokens";

export interface PushParserTokenConfiguration {
  pushPattern: RegExp;
  popPattern: RegExp;
  dummyPushPattern?: RegExp;
  includeTokens: boolean;
  getInnerVisitor: (outerVisitor?: IVisitor) => IVisitor;
  modeId?: string;
}

export interface PushParserTokenPayload extends PushParserTokenConfiguration {
  fullText: string;
  endToken: TokenType;
}

export function makePushParserTokens(
  configuration: PushParserTokenConfiguration
): TokenType[] {
  // Each invocation of makePushParserTokens() puts the tokens in their own
  // group. This allows the lexer to create a mode specifically for each group.
  const modeId = makeModeId();

  const { pushPattern, popPattern, dummyPushPattern } = configuration;
  // Create the pop token first so it can be referenced later
  const endToken = createToken({
    name: `${modeId}PopParser`,
    label: `PopParser(${popPattern})`,
    categories: [PopParser],
    pattern: popPattern,
    pop_mode: true,
    line_breaks: false,
  });

  // Start assembling the final tokens
  const tokens = [
    createToken({
      name: `${configuration.modeId ?? ""}PushParser`,
      label: `PushParser(${pushPattern})`,
      categories: [PushParser],
      pattern: makePayloadPattern(
        pushPattern,
        ({ text }: PayloadQuery): PushParserTokenPayload => ({
          ...configuration,
          fullText: text,
          endToken,
        })
      ),
      push_mode: modeId,
      line_breaks: false,
    }),
    endToken,
  ];

  // Create optional tokens
  if (dummyPushPattern) {
    if (dummyPushPattern.source === popPattern.source) {
      throw new Error(
        `cannot make push parser tokens with identical DummyPushParser and PopParser patterns (${dummyPushPattern})`
      );
    }

    tokens.push(
      createToken({
        name: `${modeId}DummyPushParser`,
        label: `DummyPushParser(${dummyPushPattern})`,
        categories: [DummyPushParser],
        pattern: dummyPushPattern,
        push_mode: modeId,
        line_breaks: false,
      })
    );
  }

  return tokens;
}
