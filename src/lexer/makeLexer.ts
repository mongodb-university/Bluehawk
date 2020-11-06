import { Lexer, MultiModesDefinition, TokenType } from "chevrotain";
import { makeAttributeListMode } from "./makeAttributeListMode";
import { makeRootMode } from "./makeRootMode";
import {
  PopParser,
  Newline,
  Space,
  Text,
  AttributeListStart,
  Identifier,
  PushParser,
  DummyPushParser,
  StringLiteral,
} from "./tokens";
import { getModeIdFromTokenName } from "./modeId";
import { tokenCategoryFilter } from "./tokenCategoryFilter";

// After a command start tag, there may be an attributes list or ID until the
// end of line.
const CommandAttributesMode = [
  AttributeListStart,
  Identifier,
  Space,
  { ...Newline, POP_MODE: true },
];

function tokensByMode(
  languageTokens: TokenType[],
  modeCategoryTokens: TokenType[]
): MultiModesDefinition {
  return tokenCategoryFilter(languageTokens, modeCategoryTokens).reduce(
    (acc, cur) => {
      const modeId = getModeIdFromTokenName(cur.name);
      if (modeId === undefined) {
        return acc;
      }
      if (!acc[modeId]) {
        acc[modeId] = [];
      }
      acc[modeId].push(cur);
      return acc;
    },
    {} as { [id: string]: TokenType[] }
  );
}

// Generates a Lexer for the given language comment patterns.
export function makeLexer(languageTokens: TokenType[]): Lexer {
  const groupedModes = Object.fromEntries(
    Object.entries(
      tokensByMode(languageTokens, [
        StringLiteral.Escape,
        StringLiteral.End,
        PushParser,
        PopParser,
        DummyPushParser,
      ])
    ).map((kv) => [kv[0], kv[1].concat([Newline, Space, Text])])
  );

  const modes: MultiModesDefinition = {
    RootMode: makeRootMode(languageTokens),
    CommandAttributesMode,
    AttributeListMode: makeAttributeListMode(languageTokens),
    ...groupedModes,
  };
  return new Lexer({
    modes,
    defaultMode: "RootMode",
  });
}
