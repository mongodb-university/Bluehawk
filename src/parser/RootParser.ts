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
} from "../lexer/tokens";
import { ErrorMessageProvider } from "./ErrorMessageProvider";

// See https://sap.github.io/chevrotain/docs/tutorial/step2_parsing.html

type Rule = (idx?: number) => CstNode;

/*

Bluehawk Root grammar:

annotatedText
  : command | blockComment | lineComment | Newline ...

command
  : Command | blockCommand

blockCommand
  : CommandStart (commandAttribute)? Newline (annotatedText)? CommandEnd

commandAttribute
  : Identifier | AttributeList

blockComment
  : BlockCommentStart (command | blockComment† | LineComment)* BlockCommentEnd

lineComment
  : (LineComment)+ (command)? (LineComment)* Newline

† = if canNestBlockComments
*/

export class RootParser extends CstParser {
  lexer: Lexer;

  annotatedText?: Rule;
  blockCommand?: Rule;
  command?: Rule;
  commandAttribute?: Rule;
  blockComment?: Rule;
  lineComment?: Rule;

  constructor(commentPatterns: CommentPatterns) {
    super(makeRootMode(commentPatterns), {
      nodeLocationTracking: "full",
      errorMessageProvider: new ErrorMessageProvider(),
    });
    this.lexer = makeLexer(commentPatterns);

    const {
      BlockCommentStart,
      BlockCommentEnd,
      LineComment,
    } = makeCommentTokens(commentPatterns);

    this.RULE("annotatedText", () => {
      this.MANY(() =>
        this.OR([
          { ALT: () => this.SUBRULE(this.command) },
          { ALT: () => this.SUBRULE(this.blockComment) },
          { ALT: () => this.SUBRULE(this.lineComment) },
          { ALT: () => this.CONSUME(Newline) },
        ])
      );
    });

    this.RULE("blockCommand", () => {
      this.CONSUME(CommandStart);
      this.OPTION(() => this.SUBRULE(this.commandAttribute));
      this.CONSUME(Newline);
      this.OPTION1(() => this.SUBRULE(this.annotatedText));
      this.CONSUME(CommandEnd);
    });

    this.RULE("blockComment", () => {
      const alternatives = [
        { ALT: () => this.SUBRULE(this.command) },
        { ALT: () => this.CONSUME(LineComment) },
        { ALT: () => this.CONSUME(Newline) },
      ];
      if (commentPatterns.canNestBlockComments) {
        alternatives.push({ ALT: () => this.SUBRULE(this.blockComment) });
      }
      this.CONSUME(BlockCommentStart);
      this.MANY(() => this.OR(alternatives));
      this.CONSUME(BlockCommentEnd);
    });

    this.RULE("command", () => {
      this.OR([
        { ALT: () => this.SUBRULE(this.blockCommand) },
        { ALT: () => this.CONSUME(Command) },
      ]);
    });

    this.RULE("commandAttribute", () => {
      this.OR([
        { ALT: () => this.CONSUME(Identifier) },
        // TODO: JSON handling
      ]);
    });

    this.RULE("lineComment", () => {
      this.AT_LEAST_ONE(() => this.CONSUME(LineComment));
      this.OPTION(() => this.SUBRULE(this.command));
      this.CONSUME(Newline);
    });

    this.performSelfAnalysis();
  }
}
