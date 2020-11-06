import { CstNode, CstParser, Lexer, TokenType } from "chevrotain";
import { BlockCommentTokenPayload } from "../lexer/makeBlockCommentTokens";
import { makeLexer } from "../lexer/makeLexer";
import { makeRootMode } from "../lexer/makeRootMode";
import { StringLiteralTokenPayload } from "../lexer/makeStringLiteralTokens";
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
  DummyPushParser,
} from "../lexer/tokens";
import { ErrorMessageProvider } from "./ErrorMessageProvider";
import { BluehawkError } from "../bluehawk";

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
  : (command | blockComment | lineComment | pushParser | stringLiteral)* Newline

command
  : blockCommand | Command

commandAttribute
  : Identifier | attributeList

lineComment
  : LineComment (Command | LineComment | BlockCommentStart | BlockCommentEnd)*

pushParser
  : PushParser (dummyPushParser | Newline)* PopParser

dummyPushParser
  : DummyPushParser (dummyPushParser | Newline)* PopParser

stringLiteral
  : StringLiteralStart (StringLiteralEscape | pushParser)* StringLiteralEnd

† = if canNest == true
*/
// While the lexer defines the tokens of the language, the parser defines the
// syntax.
export class RootParser extends CstParser implements IParser {
  lexer: Lexer;

  annotatedText?: Rule;
  chunk?: Rule;
  blockCommand?: Rule;
  command?: Rule;
  commandAttribute?: Rule;
  blockComment?: Rule;
  lineComment?: Rule;
  attributeList?: Rule;
  pushParser?: Rule;
  stringLiteral?: Rule;
  dummyPushParser?: Rule;

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
          { ALT: () => this.SUBRULE(this.stringLiteral) },
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
      this.CONSUME(CommandStart);
      this.OPTION1(() => this.SUBRULE(this.commandAttribute));
      this.CONSUME(Newline);
      this.MANY(() => this.SUBRULE(this.chunk));
      this.CONSUME(CommandEnd);
    });

    this.RULE("commandAttribute", () => {
      this.OR([
        { ALT: () => this.CONSUME(Identifier) },
        { ALT: () => this.SUBRULE(this.attributeList) },
      ]);
    });

    this.RULE("blockComment", () => {
      const payload = this.CONSUME(BlockCommentStart)
        .payload as BlockCommentTokenPayload;
      this.MANY(() =>
        this.OR([
          { ALT: () => this.SUBRULE(this.command) },
          { ALT: () => this.CONSUME(LineComment) },
          { ALT: () => this.CONSUME(Newline) },
          {
            // Only if explicitly set to `false` does this forbid nesting
            GATE: () => payload?.canNest !== false,
            ALT: () => this.SUBRULE(this.blockComment),
          },
        ])
      );
      const endToken = payload?.endToken ?? BlockCommentEnd;
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
      this.CONSUME(PushParser);
      this.MANY(() =>
        this.OR([
          // Lexer modes guarantee that the only DummyPushParser- and
          // PopParser-category tokens found in a pushParser rule are those
          // that correspond to the opening PushParser token.
          { ALT: () => this.SUBRULE(this.dummyPushParser) },
          { ALT: () => this.CONSUME(Newline) },
        ])
      );
      this.CONSUME(PopParser);
    });

    this.RULE("dummyPushParser", () => {
      this.CONSUME(DummyPushParser);
      this.MANY(() =>
        this.OR([
          { ALT: () => this.SUBRULE(this.dummyPushParser) },
          { ALT: () => this.CONSUME(Newline) },
        ])
      );
      // Ensure the end token corresponds to the start token
      this.CONSUME(PopParser);
    });

    this.RULE("stringLiteral", () => {
      const payload = this.CONSUME(StringLiteral.Start)
        .payload as StringLiteralTokenPayload;
      this.MANY(() =>
        this.OR([
          {
            GATE: () => payload?.isMultiline,
            ALT: () => this.CONSUME(Newline),
          },
          { ALT: () => this.SUBRULE(this.pushParser) },
        ])
      );
      // Ensure the end token corresponds to the start token
      this.CONSUME(payload?.endToken ?? StringLiteral.End);
    });

    // --- Add new rules ABOVE this line ---

    this.performSelfAnalysis();
  }

  parse(text: string): { cst: CstNode; errors: BluehawkError[] } {
    const tokens = this.lexer.tokenize(text);
    const tokenErrors = tokens.errors.map((error) => ({
      location: {
        line: error.line,
        column: error.column,
        offset: error.offset,
      },
      message: error.message,
    }));
    let cst: CstNode;
    if (tokenErrors.length === 0) {
      this.input = tokens.tokens;
      cst = this.annotatedText();
    }
    return {
      cst,
      errors: [
        ...tokenErrors,
        ...this.errors.map((error) => {
          // Retrieve the error location from the message because I can't seem
          // to find it on the actual error object.
          const [
            ,
            line,
            column,
            offset,
          ] = /^([0-9]+):([0-9]+)\(([0-9]+)\)/
            .exec(error.message)
            .map((result) => parseInt(result));
          return {
            location: {
              line,
              column,
              offset,
            },
            message: error.message,
          };
        }),
      ],
    };
  }
}
