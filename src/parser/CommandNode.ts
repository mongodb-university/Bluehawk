import { strict as assert } from "assert";
import { IToken } from "chevrotain";
import { Range } from "../Range";
import { CommandNodeContext } from "./visitor/makeCstVisitor";

interface VisitorContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  Newline?: IToken[];
  LineComment?: IToken[];
}

export class CommandNode {
  commandName: string;
  get inContext(): CommandNodeContext {
    return this._context[this._context.length - 1] || "none";
  }

  _context = Array<CommandNodeContext>();

  // For block commands, range from the first character of the command (start)
  // token to the last character of the command (end) token.
  range: Range;

  // Block commands have an inner range that includes the lines between the
  // attribute list and the end command token.
  contentRange?: Range;

  // Range from the beginning of the line on which the command (start) token
  // appears to the end of the line on which the command (end) token appears.
  lineRange: Range;

  // Only available in block commands:
  get id(): string | undefined {
    return this.attributes?.id;
  }
  children?: CommandNode[];

  // Attributes come from JSON and their schema depends on the command.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes?: { [member: string]: any };

  // Potentially useful tokens contained in the node
  newlines: IToken[];
  lineComments: IToken[];

  // Imports potentially useful tokens from a visitor context object.
  // Only use this in visitors that do not create the CommandNode.
  addTokensFromContext(context: VisitorContext): void {
    this.newlines.push(...(context.Newline ?? []));
    this.lineComments.push(...(context.LineComment ?? []));
  }

  // Block Commands operate on their inner range and can have children, IDs, and
  // attributes.
  makeChildBlockCommand(
    commandName: string,
    context: VisitorContext
  ): CommandNode {
    assert(this.children);
    const command = new CommandNode(commandName, context, this);
    command.children = [];
    return command;
  }

  // Line Commands operate on the line they appear in and cannot have children,
  // IDs, or attributes.
  makeChildLineCommand(
    commandName: string,
    context: VisitorContext
  ): CommandNode {
    assert(this.children);
    return new CommandNode(commandName, context, this);
  }

  withErasedBlockCommand(
    context: VisitorContext,
    callback: (erasedBlockCommand: CommandNode) => void
  ): void {
    assert(this.children);
    // We erase whatever element created the context and add what would have
    // been that element's children to the parent node. This is definitely
    // weird, but only used internally...
    const node = new CommandNode(
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
  static rootCommand(): CommandNode {
    const command = new CommandNode("__root__", {});
    command.attributes = new Map();
    command.children = [];
    return command;
  }

  private constructor(
    commandName: string,
    context: VisitorContext,
    parentToAttachTo?: CommandNode
  ) {
    this.commandName = commandName;
    this.newlines = [];
    this.lineComments = [];
    this.addTokensFromContext(context);
    if (parentToAttachTo != null) {
      this._context = [...parentToAttachTo._context];
      parentToAttachTo.children.push(this);
    }
  }
}
