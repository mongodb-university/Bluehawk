import { ICstVisitor, CstNode, IToken } from "chevrotain";
import { RootParser } from "./RootParser";

// See https://sap.github.io/chevrotain/docs/tutorial/step3a_adding_actions_visitor.html

interface AnnotatedTextContext {
  blockCommand?: CstNode[];
  blockComment?: CstNode[];
  command?: CstNode[];
  lineComment?: CstNode[];
  Newline?: IToken[];
}

interface BlockCommandContext {
  CommandStart: IToken[];
  commandAttribute?: CstNode[];
  Newline: IToken[];
  annotatedText: CstNode[];
  CommandEnd: IToken[];
}

interface BlockCommentContext {
  BlockCommentStart: IToken[];
  annotatedText: CstNode[];
  BlockCommentEnd: IToken[];
}

interface CommandContext {
  Command: IToken[];
  commandAttribute?: CstNode[];
  Newline: IToken[];
}

interface CommandAttributeContext {
  Identifier: IToken[];
  // TODO: JSON handling
}

interface LineCommentContext {
  LineComment: IToken[];
  command?: CstNode[];
  Newline: IToken[];
}

export function makeCstVisitor(parser: RootParser): ICstVisitor<void, void> {
  class CstVisitor extends parser.getBaseCstVisitorConstructor() {
    constructor() {
      super();
      // The "validateVisitor" method is a helper utility which performs static analysis
      // to detect missing or redundant visitor methods
      this.validateVisitor();
    }

    annotatedText(context: AnnotatedTextContext) {
      [
        ...(context.blockCommand ?? []),
        ...(context.blockComment ?? []),
        ...(context.command ?? []),
        ...(context.lineComment ?? []),
      ]
        .sort((a, b) => b.location.startOffset - a.location.startOffset)
        .map(this.visit.bind(this));
      return {
        ok: "ok",
      };
    }

    blockCommand(context: BlockCommandContext) {
      this.visit(context.commandAttribute);
      this.visit(context.annotatedText);
      return {
        ok: "ok",
      };
    }

    blockComment(context: BlockCommentContext) {
      this.visit(context.annotatedText);
      return {
        ok: "ok",
      };
    }

    command(context: CommandContext) {
      this.visit(context.commandAttribute);
      return {
        ok: "ok",
      };
    }

    commandAttribute(context: CommandAttributeContext) {
      return {
        ok: "ok",
      };
    }

    lineComment(context: LineCommentContext) {
      this.visit(context.command);
      return {
        ok: "ok",
      };
    }
  }

  const visitor = new CstVisitor();
  return visitor;
}
