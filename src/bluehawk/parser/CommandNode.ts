import { strict as assert } from "assert";
import { IToken } from "chevrotain";
import { Range } from "../Range";

// The CommandNode represents a command found by the visitor.
export interface CommandNode {
  // The name of the command (without -start or -end).
  commandName: string;

  // For block commands, range from the first character of the command (start)
  // token to the last character of the command (end) token. For line commands,
  // range from command token start to end.
  range: Range;

  // Range from the beginning of the line on which the command (start) token
  // appears to the end of the line on which the command (end) token appears.
  lineRange: Range;

  // Potentially useful tokens contained in the node
  newlines: IToken[];
  lineComments: IToken[];

  // The comment context the command was found in.
  inContext: CommandNodeContext;

  // Returns the id found in the attributes list or directly after the block
  // command.
  id?: string;

  // Block commands have an inner range that includes the lines between the
  // attribute list and the end command token.
  contentRange?: Range;

  // The child command nodes.
  children?: CommandNode[];

  // Attributes come from JSON and their schema depends on the command.
  attributes?: CommandNodeAttributes;
}

export interface LineCommandNode extends CommandNode {
  id: undefined;
  contentRange: undefined;
  children: undefined;
  attributes: undefined;
}

export interface BlockCommandNode extends CommandNode {
  contentRange: Range;
  children: CommandNode[];
  attributes: CommandNodeAttributes;
}

export type CommandNodeContext =
  | "none"
  | "stringLiteral"
  | "lineComment"
  | "blockComment";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CommandNodeAttributes = { [member: string]: any };

interface VisitorContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  Newline?: IToken[];
  LineComment?: IToken[];
}

export class CommandNodeImpl implements CommandNode {
  commandName: string;
  get inContext(): CommandNodeContext {
    return this._context[this._context.length - 1] || "none";
  }
  _context = Array<CommandNodeContext>();
  range: Range;
  lineRange: Range;

  // Only available in block commands
  get id(): string | undefined {
    return this.attributes?.id;
  }
  contentRange?: Range;
  children?: CommandNodeImpl[];
  attributes?: CommandNodeAttributes;
  newlines: IToken[];
  lineComments: IToken[];

  // Imports potentially useful tokens from a visitor context object.
  // Only use this in visitors that do not create the CommandNodeImpl.
  addTokensFromContext(context: VisitorContext): void {
    this.newlines.push(...(context.Newline ?? []));
    this.lineComments.push(...(context.LineComment ?? []));
  }

  // Block Commands operate on their inner range and can have children, IDs, and
  // attributes.
  makeChildBlockCommand(
    commandName: string,
    context: VisitorContext
  ): CommandNodeImpl {
    assert(this.children);
    const command = new CommandNodeImpl(commandName, context, this);
    command.children = [];
    return command;
  }

  // Line Commands operate on the line they appear in and cannot have children,
  // IDs, or attributes.
  makeChildLineCommand(
    commandName: string,
    context: VisitorContext
  ): CommandNodeImpl {
    assert(this.children);
    return new CommandNodeImpl(commandName, context, this);
  }

  withErasedBlockCommand(
    context: VisitorContext,
    callback: (erasedBlockCommand: CommandNodeImpl) => void
  ): void {
    assert(this.children);
    // We erase whatever element created the context and add what would have
    // been that element's children to the parent node. This is definitely
    // weird, but only used internally...
    const node = new CommandNodeImpl(
      "__this_should_not_be_here___please_file_a_bug__",
      context
    );
    node.children = [];
    callback(node);
    this.children.push(...node.children);
    this.newlines.push(...node.newlines);
    this.lineComments.push(...node.lineComments);
  }

  // The root command is the root node of a parsed document and contains all
  // other nodes in the document.
  static rootCommand(): CommandNodeImpl {
    const command = new CommandNodeImpl("__root__", {});
    command.children = [];
    return command;
  }

  private constructor(
    commandName: string,
    context: VisitorContext,
    parentToAttachTo?: CommandNodeImpl
  ) {
    this.commandName = commandName;
    this.newlines = [];
    this.lineComments = [];
    // FIXME: ranges should always be valid, so pass them in the constructor
    this.range = {
      start: {
        column: -1,
        line: -1,
        offset: -1,
      },
      end: {
        column: -1,
        line: -1,
        offset: -1,
      },
    };
    this.lineRange = {
      start: {
        column: -1,
        line: -1,
        offset: -1,
      },
      end: {
        column: -1,
        line: -1,
        offset: -1,
      },
    };
    this.addTokensFromContext(context);
    if (parentToAttachTo !== undefined) {
      this._context = [...parentToAttachTo._context];
      assert(parentToAttachTo.children);
      parentToAttachTo.children.push(this);
    }
  }

  asBlockCommandNode = (): BlockCommandNode | undefined => {
    if (
      this.contentRange === undefined &&
      this.children === undefined &&
      this.attributes === undefined
    ) {
      return undefined;
    }
    return this as BlockCommandNode;
  };

  asLineCommandNode = (): LineCommandNode | undefined => {
    if (
      this.contentRange === undefined &&
      this.children === undefined &&
      this.attributes === undefined
    ) {
      return this as LineCommandNode;
    }
    return undefined;
  };
}
