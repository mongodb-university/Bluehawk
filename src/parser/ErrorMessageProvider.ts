import {
  defaultParserErrorProvider,
  IParserErrorMessageProvider,
  IToken,
  TokenType,
} from "chevrotain";

export class ErrorMessageProvider implements IParserErrorMessageProvider {
  buildMismatchTokenMessage({
    expected,
    actual,
    previous,
    ruleName,
  }: {
    expected: TokenType;
    actual: IToken;
    previous: IToken;
    ruleName: string;
  }): string {
    return `${previous.startLine}:${previous.startColumn}(${previous.startOffset}) ${ruleName}: After ${previous.tokenType.name}, expected ${expected.name} but found ${actual.tokenType.name}`;
  }

  buildNotAllInputParsedMessage(options: {
    firstRedundant: IToken;
    ruleName: string;
  }): string {
    return `${options.firstRedundant.startLine}:${options.firstRedundant.startColumn}(${options.firstRedundant.startOffset}) ${options.ruleName}: expecting EOF but found ${options.firstRedundant.tokenType.name}`;
  }

  buildNoViableAltMessage(options: {
    expectedPathsPerAlt: TokenType[][][];
    actual: IToken[];
    previous: IToken;
    customUserDescription: string;
    ruleName: string;
  }): string {
    return `${options.previous.startLine}:${options.previous.startColumn}(${
      options.previous.startOffset
    }) ${
      options.ruleName
    }: expecting one of these possible token sequences: ${options.expectedPathsPerAlt
      .map((alt) =>
        alt.map((path) => path.map((a) => a.name).join()).join(" -> ")
      )
      .join(" | ")} `;
  }

  buildEarlyExitMessage(options: {
    expectedIterationPaths: TokenType[][];
    actual: IToken[];
    previous: IToken;
    customUserDescription: string;
    ruleName: string;
  }): string {
    return `${options.previous.startLine}:${options.previous.startColumn}(${
      options.previous.startOffset
    }) ${defaultParserErrorProvider.buildEarlyExitMessage(options)}`;
  }
}
