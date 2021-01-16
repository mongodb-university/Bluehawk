import { CstNode, CstParser, Lexer, TokenType } from "chevrotain";
import { makeLexer } from "./lexer/makeLexer";
import { makeRootMode } from "./lexer/makeRootMode";
import {
  AttributeListStart,
  AttributeListEnd,
  PushParser,
  PopParser,
  BlockCommentStart,
  BlockCommentEnd,
  Command,
  CommandEnd,
  CommandStart,
  Newline,
  Identifier,
  JsonStringLiteral,
  LineComment,
  StringLiteral,
} from "./lexer/tokens";
import { ErrorMessageProvider } from "./ErrorMessageProvider";
import { BluehawkError } from "../BluehawkError";

// See https://sap.github.io/chevrotain/docs/tutorial/step2_parsing.html

type Rule = (idx?: number) => CstNode;

interface ParserResult {
  cst?: CstNode;
  errors: BluehawkError[];
}

export interface IParser {
  parse(text: string): ParserResult;
}

// Comment awareness prevents bluehawk from outputting half-commented code
// blocks.
/*

BLUEHAWK SYNTAX

   ╔════════════════════════════════════════╗
   ║  LEGEND                                ║
   ║========================================║▒▒
   ║  starts with capital letter = token    ║▒▒
   ║  starts with lowercase letter = rule   ║▒▒
   ║  : = rule definition                   ║▒▒
   ║  | = or                                ║▒▒
   ║  ( )* = any                            ║▒▒
   ║  ( )? = 0 or 1                         ║▒▒
   ║  ( )+ = 1 or more                      ║▒▒
   ╚════════════════════════════════════════╝▒▒
     ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒


annotatedText
  : (chunk)*

attributeList
  : AttributeListStart (AttributeListStart | AttributeListEnd | JsonStringLiteral | Newline | LineComment)* AttributeListEnd

blockCommand
  : (LineComment)? CommandStart (commandAttribute)? Newline (chunk)* (LineComment)* CommandEnd

blockComment
  : BlockCommentStart (command | LineComment | NewLine | blockComment†)* BlockCommentEnd

chunk
  : (command | blockComment | lineComment | pushParser | StringLiteral)* Newline

command
  : blockCommand | Command

commandAttribute
  : Identifier | attributeList

lineComment
  : LineComment (Command | LineComment | BlockCommentStart | BlockCommentEnd)*

pushParser
  : PushParser_X (pushParser | Newline)* PopParser_X

† = if canNestBlockComments
*/

// While the lexer defines the tokens of the language, the parser defines the
// syntax.
export class RootParser extends CstParser implements IParser {
  lexer: Lexer;

  annotatedText: Rule;
  chunk: Rule;
  blockCommand: Rule;
  command: Rule;
  commandAttribute: Rule;
  blockComment: Rule;
  lineComment: Rule;
  attributeList: Rule;
  pushParser: Rule;

  constructor(languageTokens: TokenType[]) {
    super(makeRootMode(languageTokens), {
      nodeLocationTracking: "full",
      errorMessageProvider: new ErrorMessageProvider(),
    });
    this.lexer = makeLexer(languageTokens);

    // annotatedText is the root rule and is a series of zero or more chunks
    this.RULE("annotatedText", () => {
      this.MANY(() => this.SUBRULE(this.chunk));
    });

    // A chunk is roughly a line of text or block(s) followed by a newline. We
    // have to distinguish chunk from annotatedText in order to be able to
    // distinguish a LineComment near the end of a blockCommand from a
    // LineComment within a blockCommand's inner chunks.
    this.RULE("chunk", () => {
      this.MANY(() => {
        this.OR([
          { ALT: () => this.SUBRULE(this.command) },
          { ALT: () => this.SUBRULE(this.blockComment) },
          { ALT: () => this.SUBRULE(this.lineComment) },
          { ALT: () => this.SUBRULE(this.pushParser) },
          { ALT: () => this.CONSUME(StringLiteral) },
        ]);
      });
      this.OR1([
        { ALT: () => this.CONSUME(Newline) },
        {
          // Allow for lineComment lines to end without a newline
          GATE: () => this.LA(1).tokenType.name === CommandEnd.name,
          ALT: () => {
            return;
          },
        },
      ]);
    });

    this.RULE("command", () => {
      this.OR([
        { ALT: () => this.SUBRULE(this.blockCommand) },
        { ALT: () => this.CONSUME(Command) },
      ]);
    });

    this.RULE("blockCommand", () => {
      const startToken = this.CONSUME(CommandStart);
      this.OPTION1(() => this.SUBRULE(this.commandAttribute));
      this.CONSUME(Newline);
      this.MANY(() => this.SUBRULE(this.chunk));
      const endToken = startToken.payload?.endToken ?? CommandEnd;
      this.CONSUME(endToken);
    });

    this.RULE("commandAttribute", () => {
      this.OR([
        { ALT: () => this.CONSUME(Identifier) },
        { ALT: () => this.SUBRULE(this.attributeList) },
      ]);
    });

    this.RULE("blockComment", () => {
      const startToken = this.CONSUME(BlockCommentStart);
      this.MANY(() =>
        this.OR([
          { ALT: () => this.SUBRULE(this.command) },
          { ALT: () => this.CONSUME(LineComment) },
          { ALT: () => this.CONSUME(Newline) },
          {
            // Only if explicitly set to `false` does this forbid nesting
            GATE: () => startToken.payload?.canNest !== false,
            ALT: () => this.SUBRULE(this.blockComment),
          },
        ])
      );
      const endToken = startToken.payload?.endToken ?? BlockCommentEnd;
      this.CONSUME(endToken);
    });

    this.RULE("lineComment", () => {
      this.CONSUME(LineComment);
      this.MANY(() =>
        this.OR([
          { ALT: () => this.SUBRULE(this.command) },
          { ALT: () => this.CONSUME1(LineComment) },
          { ALT: () => this.CONSUME(BlockCommentStart) },
          { ALT: () => this.CONSUME(BlockCommentEnd) },
        ])
      );
    });

    this.RULE("attributeList", () => {
      this.CONSUME(AttributeListStart);
      // Simply consume the JSON tokens and allow the JSON.parse() function in
      // the visitor to report errors.
      this.MANY(() => {
        // Consume any token but block comment tokens. We disallow block comment
        // tokens here because it prevents block comment straddling in block
        // commands.
        this.OR([
          { ALT: () => this.CONSUME(LineComment) },
          { ALT: () => this.CONSUME(Newline) },
          { ALT: () => this.CONSUME(JsonStringLiteral) },
          {
            // Handle subobjects
            ALT: () => this.SUBRULE(this.attributeList),
          },
        ]);
      });
      this.CONSUME(AttributeListEnd);
    });

    this.RULE("pushParser", () => {
      // pushParser leaves a block of text unparsed by this parser, allowing the
      // visitor to parse that section with a different parser
      const pushToken = this.CONSUME(PushParser);
      this.MANY(() =>
        this.OR([
          { ALT: () => this.SUBRULE(this.pushParser) },
          { ALT: () => this.CONSUME(Newline) },
        ])
      );
      // Ensure the end token corresponds to the starting token
      const popToken = pushToken.payload?.endToken ?? PopParser;
      this.CONSUME(popToken);
    });

    this.performSelfAnalysis();
  }

  parse(text: string): { cst?: CstNode; errors: BluehawkError[] } {
    const tokens = this.lexer.tokenize(text);
    const tokenErrors = tokens.errors.map(
      (error): BluehawkError => ({
        component: "lexer",
        location: {
          line: error.line,
          column: error.column,
          offset: error.offset,
        },
        message: error.message,
      })
    );
    if (tokenErrors.length !== 0) {
      return {
        cst: undefined,
        errors: tokenErrors,
      };
    }
    this.input = tokens.tokens;
    const cst = this.annotatedText();
    return {
      cst,
      errors: [
        ...tokenErrors,
        ...this.errors.map(
          (error): BluehawkError => {
            // Retrieve the error location from the message because I can't seem
            // to find it on the actual error object.
            const lineColumnOffset = /^([0-9]+):([0-9]+)\(([0-9]+)\)/
              .exec(error?.message)
              ?.map((result) => parseInt(result)) ?? [-1, -1, -1, -1];
            const [, line, column, offset] = lineColumnOffset;
            return {
              component: "parser",
              location: {
                line,
                column,
                offset,
              },
              message: error.message,
            };
          }
        ),
      ],
    };
  }
}
