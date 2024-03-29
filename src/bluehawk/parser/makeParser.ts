import { TagProcessors } from "./../processor/Processor";
import { Document } from "../Document";
import { LanguageSpecification } from "./LanguageSpecification";
import {
  makeBlockCommentTokens,
  makeLineCommentToken,
  makePushParserTokens,
} from "./lexer";
import { makeStringLiteralToken } from "./lexer/makeStringLiteralToken";
import { ParseResult } from "./ParseResult";
import { RootParser } from "./RootParser";
import { makeCstVisitor } from "./visitor";
import { validateTags } from "./validator";

// Complete parser (lexicon, syntax, and semantics).
export interface IParser {
  languageSpecification: LanguageSpecification;
  parse(args: { source: Document; tagProcessors?: TagProcessors }): ParseResult;
}

// Token patterns are required to be sticky (y flag)
const makeSticky = (re: RegExp): RegExp => {
  if (re.sticky) {
    return re;
  }
  return new RegExp(re, re.flags + "y");
};

export function makeParser(
  languageSpecification: LanguageSpecification
): IParser {
  const { lineComments, blockComments, stringLiterals, parserPushers } =
    languageSpecification;
  const languageTokens = [
    ...(lineComments ?? []).map(makeSticky).map(makeLineCommentToken),
    ...(blockComments ?? [])
      .map(([startPattern, endPattern]) =>
        makeBlockCommentTokens(makeSticky(startPattern), makeSticky(endPattern))
      )
      .flat(),
    ...(stringLiterals ?? []).map(({ pattern, multiline }) =>
      makeStringLiteralToken(makeSticky(pattern), multiline)
    ),
    ...(parserPushers ?? [])
      .map(
        ({
          languageId,
          patterns,
          startNewParserOnPushToken,
          endNewParserAfterPopToken,
        }) =>
          makePushParserTokens(patterns[0], patterns[1], {
            parserId: languageId,
            includePushTokenInSubstring: startNewParserOnPushToken ?? false,
            includePopTokenInSubstring: endNewParserAfterPopToken ?? false,
          })
      )
      .flat(),
  ];
  const syntaxProcessor = new RootParser(languageTokens);
  const semanticsProcessor = makeCstVisitor(syntaxProcessor);
  return {
    parse({ source, tagProcessors }) {
      // ⚠️ Caller is responsible for making sure this parser is appropriate for
      // the source language
      const parseResult = syntaxProcessor.parse(source.text.original);
      if (parseResult.cst === undefined) {
        return {
          tagNodes: [],
          errors: parseResult.errors,
          source,
          languageSpecification,
        };
      }
      const visitorResult = semanticsProcessor.visit(parseResult.cst, source);

      const validateErrors =
        tagProcessors !== undefined
          ? validateTags(visitorResult.tagNodes, tagProcessors)
          : [];
      return {
        errors: [
          ...parseResult.errors,
          ...visitorResult.errors,
          ...validateErrors,
        ],
        tagNodes: visitorResult.tagNodes,
        source,
        languageSpecification,
      };
    },
    languageSpecification,
  };
}
