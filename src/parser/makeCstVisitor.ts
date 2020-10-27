import { ICstVisitor, CstNode, IToken } from "chevrotain";
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
  chunk?: CstNode[];
}

interface AttributeListContext {
  AttributeListStart: IToken[];
  AttributeListEnd: IToken[];
}

interface BlockCommandContext {
  LineComment?: IToken[];
  CommandStart: IToken[];
  commandAttribute?: CstNode[];
  Newline: IToken[];
  annotatedText: CstNode[];
  CommandEnd: IToken[];
}

interface BlockCommentContext {
  BlockCommentStart: IToken[];
  command?: CstNode[];
  LineComment?: IToken[];
  Newline?: IToken[];
  blockComment?: CstNode[];
  BlockCommentEnd: IToken[];
}

interface ChunkContext {
  blockComment?: CstNode[];
  command?: CstNode[];
  lineComment?: CstNode[];
  Newline: IToken[];
}

interface CommandContext {
  Command?: IToken[];
  blockCommand?: CstNode[];
}

interface CommandAttributeContext {
  Identifier?: IToken[];
  attributeList?: CstNode[];
}

interface LineCommentContext {
  LineComment: IToken[];
  Command?: IToken[];
  BlockCommentStart?: IToken[];
  BlockCommentEnd?: IToken[];
}

interface VisitorError {
  message: string;
  location: Location;
}

interface VisitorResult {
  errors: VisitorError[];
  anchors: [];
}

// While the lexer defines the tokens (words) and the parser defines the syntax,
// the CstVisitor defines the semantics of the language.
export function makeCstVisitor(
  parser: RootParser
): ICstVisitor<void, VisitorResult> {
  const { canNestBlockComments } = parser.commentPatterns;
  return new (class CstVisitor extends parser.getBaseCstVisitorConstructor() {
    constructor() {
      super();
      // The "validateVisitor" method is a helper utility which performs static analysis
      // to detect missing or redundant visitor methods
      this.validateVisitor();
    }

    // This override corrects the underlying method's return type
    visit(node: CstNode | CstNode[]): VisitorResult {
      return super.visit(node);
    }

    annotatedText(context: AnnotatedTextContext): VisitorResult {
      // Flatten the tree to two lists (errors and elements) ordered by their
      // appearance in the file.
      return (context.chunk ?? [])
        .sort((a, b) => b.location.startOffset - a.location.startOffset)
        .map((chunk) => this.visit(chunk))
        .reduce(
          (acc, cur) => ({
            errors: [...acc.errors, ...cur.errors],
            anchors: [...acc.anchors, ...cur.anchors],
          }),
          { errors: [], anchors: [] }
        );
    }

    attributeList(context: AttributeListContext): VisitorResult {
      return { errors: [], anchors: [] };
    }

    blockCommand(context: BlockCommandContext): VisitorResult {
      // Extract the command name ("example") from the
      // ":example-start:"/":example-end:" tokens and compare them.
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
        errors: [
          ...(attributeResult?.errors ?? []),
          ...(textResult?.errors ?? []),
        ],
        anchors: [
          ...(attributeResult?.anchors ?? []),
          ...(textResult?.anchors ?? []),
        ],
      };
    }

    blockComment(context: BlockCommentContext): VisitorResult {
      return this.visit(context.blockComment);
    }

    chunk(context: ChunkContext): VisitorResult {
      return [
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
      return { errors: [], anchors: [] };
    }
  })();
}
