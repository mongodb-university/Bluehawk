import { CstNode, CstParser, Lexer } from "chevrotain";
import { CommentPatterns } from "../lexer/CommentPatterns";
import { makeCommentTokens } from "../lexer/makeCommentTokens";
import { makeLexer } from "../lexer/makeLexer";
import { makeRootMode } from "../lexer/makeRootMode";
import {
  Command,
  CommandEnd,
  CommandStart,
  Newline,
  Identifier,
  AttributeListStart,
  AttributeListEnd,
} from "../lexer/tokens";
import { ErrorMessageProvider } from "./ErrorMessageProvider";

// See https://sap.github.io/chevrotain/docs/tutorial/step2_parsing.html

type Rule = (idx?: number) => CstNode;

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
  : AttributeListStart <TODO JSON> AttributeListEnd

blockCommand
  : (LineComment)? CommandStart (commandAttribute)? Newline (annotatedText)? (LineComment)? CommandEnd

blockComment
  : BlockCommentStart (command | LineComment | NewLine | blockComment†)* BlockCommentEnd

chunk
  : (command | blockComment | lineComment)* Newline

command
  : blockCommand | Command

commandAttribute
  : Identifier | attributeList

lineComment
  : LineComment (Command | LineComment | BlockCommentStart | BlockCommentEnd)*

† = if canNestBlockComments
*/

// While the lexer defines the tokens of the language, the parser defines the
// syntax.
export class RootParser extends CstParser {
  lexer: Lexer;
  commentPatterns: CommentPatterns;

  annotatedText?: Rule;
  chunk?: Rule;
  blockCommand?: Rule;
  command?: Rule;
  commandAttribute?: Rule;
  blockComment?: Rule;
  lineComment?: Rule;
  attributeList?: Rule;

  constructor(commentPatterns: CommentPatterns) {
    super(makeRootMode(commentPatterns), {
      nodeLocationTracking: "full",
      errorMessageProvider: new ErrorMessageProvider(),
    });
    this.lexer = makeLexer(commentPatterns);
    this.commentPatterns = commentPatterns;

    const {
      BlockCommentStart,
      BlockCommentEnd,
      LineComment,
    } = makeCommentTokens(commentPatterns);

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
        ]);
      });
      this.CONSUME(Newline);
    });

    this.RULE("command", () => {
      this.OR([
        { ALT: () => this.SUBRULE(this.blockCommand) },
        { ALT: () => this.CONSUME(Command) },
      ]);
    });

    this.RULE("blockCommand", () => {
      this.OPTION(() => this.CONSUME(LineComment));
      this.CONSUME(CommandStart);
      this.OPTION1(() => this.SUBRULE(this.commandAttribute));
      this.MANY(() => this.SUBRULE(this.chunk));
      this.OPTION2(() => this.CONSUME1(LineComment));
      this.CONSUME(CommandEnd);
    });

    this.RULE("commandAttribute", () => {
      this.OR([
        { ALT: () => this.CONSUME(Identifier) },
        { ALT: () => this.SUBRULE(this.attributeList) },
      ]);
    });

    this.RULE("blockComment", () => {
      this.CONSUME(BlockCommentStart);
      const alternatives = [
        { ALT: () => this.SUBRULE(this.command) },
        { ALT: () => this.CONSUME(LineComment) },
        { ALT: () => this.CONSUME(Newline) },
      ];
      if (commentPatterns.canNestBlockComments) {
        alternatives.push({ ALT: () => this.SUBRULE(this.blockComment) });
      }
      this.MANY(() => this.OR(alternatives));
      this.CONSUME(BlockCommentEnd);
    });

    this.RULE("lineComment", () => {
      this.CONSUME(LineComment);
      this.MANY(() =>
        this.OR([
          { ALT: () => this.CONSUME1(Command) },
          { ALT: () => this.CONSUME1(LineComment) },
          { ALT: () => this.CONSUME(BlockCommentStart) },
          { ALT: () => this.CONSUME(BlockCommentEnd) },
        ])
      );
    });

    this.RULE("attributeList", () => {
      this.CONSUME(AttributeListStart);
      // TODO: So, want to support attribute lists, do ya?
      // Defer to JSON parser.
      this.CONSUME(AttributeListEnd);
    });

    this.performSelfAnalysis();
  }
}
