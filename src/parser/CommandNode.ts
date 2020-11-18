import { strict as assert } from "assert";
import { BluehawkSource, Range } from "../bluehawk";
import { CommandNodeContext } from "./makeCstVisitor";

export class CommandNode {
  commandName: string;
  get inContext(): CommandNodeContext {
    return this._context[this._context.length - 1] || "none";
  }

  _context = Array<CommandNodeContext>();

  // ranges covered by this node
  range: Range;
  contentRange?: Range;

  source: BluehawkSource;

  // Contains the inner content from the source (block commands only).
  get content(): string | undefined {
    const { contentRange } = this;
    return contentRange
      ? this.source.text.substring(
          contentRange.start.offset,
          contentRange.end.offset
        )
      : undefined;
  }

  // Only available in block commands:
  get id(): string | undefined {
    return this.attributes?.id;
  }
  children?: CommandNode[];

  // Attributes come from JSON and their schema depends on the command.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes?: { [member: string]: any };

  // Block Commands operate on their inner range and can have children, IDs, and
  // attributes.
  makeChildBlockCommand(commandName: string): CommandNode {
    assert(this.children);
    const command = new CommandNode(commandName, this.source, this);
    command.children = [];
    return command;
  }

  // Line Commands operate on the line they appear in and cannot have children,
  // IDs, or attributes.
  makeChildLineCommand(commandName: string): CommandNode {
    assert(this.children);
    return new CommandNode(commandName, this.source, this);
  }

  withErasedBlockCommand(
    callback: (erasedBlockCommand: CommandNode) => void
  ): void {
    assert(this.children);
    // We erase whatever element created the context and add what would have
    // been that element's children to the parent node. This is definitely
    // weird, but only used internally...
    const node = new CommandNode(
      "__this_should_not_be_here___please_file_a_bug__",
      this.source
    );
    node.children = [];
    callback(node);
    this.children = [...this.children, ...node.children];
  }

  // The root command is the root node of a parsed document and contains all
  // other nodes in the document.
  static rootCommand(source: BluehawkSource): CommandNode {
    const command = new CommandNode("__root__", source);
    command.attributes = new Map();
    command.children = [];
    return command;
  }

  private constructor(
    commandName: string,
    source: BluehawkSource,
    parentToAttachTo?: CommandNode
  ) {
    this.commandName = commandName;
    this.source = source;
    if (parentToAttachTo != null) {
      this._context = [...parentToAttachTo._context];
      parentToAttachTo.children.push(this);
    }
  }
}
