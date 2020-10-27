import { ICstVisitor, CstNode, IToken } from "chevrotain";
import { assert } from "console";
import { COMMAND_END_PATTERN, COMMAND_START_PATTERN } from "../lexer/tokens";
import { RootParser } from "./RootParser";

// See https://sap.github.io/chevrotain/docs/tutorial/step3a_adding_actions_visitor.html

interface Location {
  line: number;
  column: number;
  offset: number;
}

function locationFromToken(token: IToken): Location {
  return {
    line: token.startLine,
    column: token.startColumn,
    offset: token.startOffset,
  };
}

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
  Command?: IToken[];
  blockCommand?: CstNode[];
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

interface VisitorError {
  message: string;
  location: Location;
}

interface VisitorResult {
  errors: VisitorError[];
  anchors: [];
}

export function makeCstVisitor(
  parser: RootParser
): ICstVisitor<void, VisitorResult> {
  return new (class CstVisitor extends parser.getBaseCstVisitorConstructor() {
    constructor() {
      super();
      // The "validateVisitor" method is a helper utility which performs static analysis
      // to detect missing or redundant visitor methods
      this.validateVisitor();
    }

    // Correct the underlying return type
    visit(node: CstNode | CstNode[]): VisitorResult {
      return super.visit(node);
    }

    annotatedText(context: AnnotatedTextContext): VisitorResult {
      return [
        ...(context.blockCommand ?? []),
        ...(context.blockComment ?? []),
        ...(context.command ?? []),
        ...(context.lineComment ?? []),
      ]
        .sort((a, b) => b.location.startOffset - a.location.startOffset)
        .map((node) => this.visit(node))
        .reduce(
          (acc, cur) => ({
            errors: [...acc.errors, ...cur.errors],
            anchors: [...acc.anchors, ...cur.anchors],
          }),
          { errors: [], anchors: [] }
        );
    }

    blockCommand(context: BlockCommandContext): VisitorResult {
      const startCommandName = COMMAND_START_PATTERN.exec(
        context.CommandStart[0].image
      )[1];

      const endCommandName = COMMAND_END_PATTERN.exec(
        context.CommandEnd[0].image
      )[1];

      if (startCommandName !== endCommandName) {
        return {
          errors: [
            {
              location: locationFromToken(context.CommandEnd[0]),
              message: `Unexpected ${endCommandName}-end closing ${startCommandName}-start`,
            },
          ],
          anchors: [],
        };
      }

      const attributeResult = this.visit(context.commandAttribute);
      const textResult = this.visit(context.annotatedText);
      return {
        errors: [...(attributeResult?.errors ?? []), ...textResult.errors],
        anchors: [...(attributeResult?.anchors ?? []), ...textResult.anchors],
      };
    }

    blockComment(context: BlockCommentContext): VisitorResult {
      return this.visit(context.annotatedText);
    }

    command(context: CommandContext): VisitorResult {
      if (context.blockCommand) {
        return this.visit(context.blockCommand);
      }
      return { errors: [], anchors: [] };
    }

    commandAttribute(context: CommandAttributeContext): VisitorResult {
      return { errors: [], anchors: [] };
    }

    lineComment(context: LineCommentContext): VisitorResult {
      return this.visit(context.command);
    }
  })();
}
