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

type Rule = (idx?: number) => CstNode;

/*

Bluehawk Root grammar:

annotatedText
  : blockCommand | command | blockComment | lineComment | Newline ...

blockCommand
  : CommandStart (commandAttribute)? Newline (annotatedText)? CommandEnd

blockComment
  : BlockCommentStart annotatedText BlockCommentEnd

command
  : Command (commandAttribute)? Newline

commandAttribute
  : Identifier | AttributeList

lineComment
  : LineComment (command)? Newline

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
          { ALT: () => this.SUBRULE(this.blockCommand) },
          { ALT: () => this.SUBRULE(this.blockComment) },
          { ALT: () => this.SUBRULE(this.command) },
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
      this.CONSUME(BlockCommentStart);
      this.SUBRULE(this.annotatedText);
      this.CONSUME(BlockCommentEnd);
    });

    this.RULE("command", () => {
      this.CONSUME(Command);
      this.OPTION(() => this.SUBRULE(this.commandAttribute));
      this.CONSUME(Newline);
    });

    this.RULE("commandAttribute", () => {
      this.OR([
        { ALT: () => this.CONSUME(Identifier) },
        // TODO: JSON handling
      ]);
    });

    this.RULE("lineComment", () => {
      this.CONSUME(LineComment);
      this.OPTION(() => this.SUBRULE(this.command));
      this.CONSUME(Newline);
    });

    this.performSelfAnalysis();
  }
}
