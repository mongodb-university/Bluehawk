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
    return `${previous.startLine}:${previous.startColumn} ${ruleName}: After ${previous.tokenType.name}, expected ${expected.name} but found ${actual.tokenType.name}`;
  }

  buildNotAllInputParsedMessage(options: {
    firstRedundant: IToken;
    ruleName: string;
  }): string {
    return `${options.firstRedundant.startLine}:${options.firstRedundant.startColumn} ${options.ruleName}: expecting EOF but found ${options.firstRedundant.tokenType.name}`;
  }

  buildNoViableAltMessage(options: {
    expectedPathsPerAlt: TokenType[][][];
    actual: IToken[];
    previous: IToken;
    customUserDescription: string;
    ruleName: string;
  }): string {
    return `${options.actual[0].startLine}:${options.actual[0].startColumn} ${
      options.ruleName
    }: ${defaultParserErrorProvider.buildNoViableAltMessage(options)}`;
  }

  buildEarlyExitMessage(options: {
    expectedIterationPaths: TokenType[][];
    actual: IToken[];
    previous: IToken;
    customUserDescription: string;
    ruleName: string;
  }): string {
    return defaultParserErrorProvider.buildEarlyExitMessage(options);
  }
}
