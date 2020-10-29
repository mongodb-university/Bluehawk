import { CstNode, IToken } from "chevrotain";
import { assert } from "console";
import {
  COMMAND_END_PATTERN,
  COMMAND_PATTERN,
  COMMAND_START_PATTERN,
} from "../lexer/tokens";
import { RootParser } from "./RootParser";

// See https://sap.github.io/chevrotain/docs/tutorial/step3a_adding_actions$visitor.html

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

// For whatever reason, chevrotain always provides arrays of CstNodes, even if
// you know there can only be one.
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
  chunk: CstNode[];
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
  command?: CstNode[];
  BlockCommentStart?: IToken[];
  BlockCommentEnd?: IToken[];
}

interface VisitorError {
  message: string;
  location: Location;
}

interface VisitorResult {
  errors: VisitorError[];
  commands: CommandNode[];
}

type CommandAttributes = Map<string, string | boolean | number>;
type CommandNodeContext =
  | "none"
  | "stringLiteral"
  | "lineComment"
  | "blockComment";

class CommandNode {
  commandName: string;
  inContext: CommandNodeContext = "none";
  // TODO: range(s)
  // Only available in block commands:
  id?: string;
  attributes?: CommandAttributes;
  children?: CommandNode[];

  // Block Commands operate on their inner range and can have children, IDs, and
  // attributes.
  makeChildBlockCommand(commandName: string): CommandNode {
    assert(this.children);
    const command = new CommandNode(commandName, this);
    command.attributes = new Map();
    command.children = [];
    return command;
  }

  // Line Commands operate on the line they appear in and cannot have children,
  // IDs, or attributes.
  makeChildLineCommand(commandName: string): CommandNode {
    assert(this.children);
    return new CommandNode(commandName, this);
  }

  withErasedBlockCommand(callback: (erasedBlockCommand: CommandNode) => void) {
    assert(this.children);
    // We erase whatever element created the context and add what would have
    // been that element's children to the parent node. This is definitely
    // weird, but only used internally...
    const node = new CommandNode(
      "__this_should_not_be_here___please_file_a_bug__"
    );
    node.children = [];
    callback(node);
    this.children = [...this.children, ...node.children];
  }

  // The root command is the root node of a parsed document and contains all
  // other nodes in the document.
  static rootCommand(): CommandNode {
    const command = new CommandNode("__root__");
    command.attributes = new Map();
    command.children = [];
    return command;
  }

  private constructor(commandName: string, parentToAttachTo?: CommandNode) {
    this.commandName = commandName;
    if (parentToAttachTo != null) {
      this.inContext = parentToAttachTo.inContext;
      parentToAttachTo.children.push(this);
    }
  }
}

interface IVisitor {
  visit(node: CstNode): VisitorResult;
}

// While the lexer defines the tokens (words) and the parser defines the syntax,
// the CstVisitor defines the semantics of the language.
export function makeCstVisitor(parser: RootParser): IVisitor {
  const { canNestBlockComments } = parser.commentPatterns;
  return new (class CstVisitor extends parser.getBaseCstVisitorConstructor() {
    constructor() {
      super();
      // The "validateVisitor" method is a helper utility which performs static analysis
      // to detect missing or redundant visitor methods
      this.validateVisitor();
    }

    // The entrypoint for the visitor.
    visit(node: CstNode): VisitorResult {
      const root = CommandNode.rootCommand();
      this.$visit([node], root);
      const errors = [];
      return {
        errors,
        commands: root.children,
      };
    }

    // chevrotain requires helper methods to begin with a token other than
    // [0-9A-z-_] which leaves... $?
    private $visit(nodes: CstNode[] | undefined, parent: CommandNode) {
      assert(parent != null);
      if (nodes) {
        nodes.forEach((node) => super.visit(node, parent));
      }
    }

    annotatedText(context: AnnotatedTextContext, parent: CommandNode) {
      assert(parent != null);
      // Flatten annotatedText and chunks to one list ordered by appearance in
      // the file and allow each chunk to add to the parent's child list.
      this.$visit(
        (context.chunk ?? []).sort(
          (a, b) => a.location.startOffset - b.location.startOffset
        ),
        parent
      );
    }

    attributeList(context: AttributeListContext, parent: CommandNode) {
      assert(parent != null);
      // TODO: populate parent's attributes
    }

    blockCommand(context: BlockCommandContext, parent: CommandNode) {
      assert(parent != null);

      // Extract the command name ("example") from the
      // ":example-start:"/":example-end:" tokens
      const commandName = COMMAND_START_PATTERN.exec(
        context.CommandStart[0].image
      )[1];
      assert(commandName);

      const newNode = parent.makeChildBlockCommand(commandName);

      const endCommandName = COMMAND_END_PATTERN.exec(
        context.CommandEnd[0].image
      )[1];

      // Compare start/end name to ensure it is the same command
      if (newNode.commandName !== endCommandName) {
        /*
        newNode.diagnostics.push({
          location: locationFromToken(context.CommandEnd[0]),
          message: `Unexpected ${endCommandName}-end closing ${newNode.commandName}-start`,
        });
        */
      }

      this.$visit(context.commandAttribute, newNode);
      this.$visit(context.chunk, newNode);
    }

    blockComment(context: BlockCommentContext, parent: CommandNode) {
      assert(parent != null);
      // This indicates a problem with the parser. Please file a bug with the
      // markup that triggered this assertion failure.
      assert(
        parent.inContext === "none" ||
          (canNestBlockComments && parent.inContext === "blockComment")
      );
      assert(context.blockComment == null || canNestBlockComments);

      // This node (blockComment) should not be included in the final output. We
      // use it to gather child nodes and attach them to the parent node.
      parent.withErasedBlockCommand((erasedBlockCommand) => {
        erasedBlockCommand.inContext = "blockComment";
        this.$visit(
          [...(context.blockComment ?? []), ...(context.command ?? [])],
          erasedBlockCommand
        );
      });
    }

    chunk(context: ChunkContext, parent: CommandNode) {
      assert(parent != null);
      // Like annotatedText, merge all child nodes into a list of children
      // attached to the parent node, ordered by their appearance in the
      // document.
      this.$visit(
        [
          ...(context.blockComment ?? []),
          ...(context.command ?? []),
          ...(context.lineComment ?? []),
        ].sort((a, b) => a.location.startOffset - b.location.startOffset),
        parent
      );
    }

    command(context: CommandContext, parent: CommandNode) {
      assert(parent != null);
      if (context.blockCommand) {
        assert(!context.Command); // Parser issue!
        this.$visit(context.blockCommand, parent);
        return;
      }
      assert(context.Command);
      context.Command.forEach((Command) =>
        parent.makeChildLineCommand(COMMAND_PATTERN.exec(Command.image)[1])
      );
    }

    commandAttribute(context: CommandAttributeContext, node: CommandNode) {
      assert(node != null);
      const Identifier = context.Identifier[0];
      const attributeList = context.attributeList;
      if (Identifier != undefined) {
        assert(!attributeList); // parser issue
        assert(Identifier.image.length > 0);
        node.id = Identifier.image;
      } else if (context.attributeList != undefined) {
        assert(!Identifier); // parser issue
        assert(attributeList.length === 1); // should be impossible to have more than 1 list
        this.$visit(attributeList, node);
      }
    }

    lineComment(context: LineCommentContext, parent: CommandNode) {
      assert(parent != null);
      assert(parent.inContext === "none");
      const { command } = context;
      if (command === undefined) {
        return;
      }
      parent.withErasedBlockCommand((erasedBlockCommand) => {
        // Any blockCommand that starts in a lineComment by definition MUST be
        // on the same line as the line comment
        erasedBlockCommand.inContext = "lineComment";
        this.$visit(command, erasedBlockCommand);
      });
    }
  })();
}
