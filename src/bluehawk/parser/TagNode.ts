import { strict as assert } from "assert";
import { IToken } from "chevrotain";
import { Range } from "../Range";

// The TagNode represents a tag found by the visitor.
interface TagNode {
  type: "line" | "block";

  // The name of the tag (without -start or -end).
  tagName: string;

  // For block tags, range from the first character of the tag (start)
  // token to the last character of the tag (end) token. For line tags,
  // range from tag token start to end.
  range: Range;

  // Range from the beginning of the line on which the tag (start) token
  // appears to the end of the line on which the tag (end) token appears.
  lineRange: Range;

  // Potentially useful tokens contained in the node
  newlines: IToken[];
  lineComments: IToken[];

  // The comment tokens on the line the tag was found in, if any.
  associatedTokens: IToken[];

  // The comment context the tag was found in.
  inContext: TagNodeContext;

  // Returns the id found in the attributes list or directly after the block
  // tag.
  id?: string[];

  // Block tags have an inner range that includes the lines between the
  // attribute list and the end tag token.
  contentRange?: Range;

  // The child tag nodes.
  children?: TagNode[];

  // Attributes come from JSON and their schema depends on the tag.
  attributes?: TagNodeAttributes;
}

// A line tag applies to a specific line and does not have -start or -end
// tags.
export interface LineTagNode extends TagNode {
  type: "line";
  id: undefined;
  contentRange: undefined;
  children: undefined;
  attributes: undefined;
}

// A block tag applies to a range of lines and has -start and -end tags.
export interface BlockTagNode extends TagNode {
  type: "block";
  contentRange: Range;
  children: AnyTagNode[];
  attributes: TagNodeAttributes;
}

export type AnyTagNode = LineTagNode | BlockTagNode;

export type TagNodeContext =
  | "none"
  | "stringLiteral"
  | "lineComment"
  | "blockComment";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TagNodeAttributes = { [member: string]: any };

interface VisitorContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  Newline?: IToken[];
  LineComment?: IToken[];
}

export class TagNodeImpl implements TagNode {
  type: "line" | "block";
  tagName: string;
  get inContext(): TagNodeContext {
    return this._context[this._context.length - 1] || "none";
  }
  _context = Array<TagNodeContext>();
  range: Range;
  lineRange: Range;

  // Only available in block tags
  get id(): string[] | undefined {
    return this.attributes?.id;
  }
  contentRange?: Range;
  children?: TagNodeImpl[];
  attributes?: TagNodeAttributes;
  newlines: IToken[] = [];
  lineComments: IToken[] = [];
  associatedTokens: IToken[] = [];

  // Imports potentially useful tokens from a visitor context object.
  // Only use this in visitors that do not create the TagNodeImpl.
  addTokensFromContext(context: VisitorContext): void {
    this.newlines.push(...(context.Newline ?? []));
    this.lineComments.push(...(context.LineComment ?? []));
  }

  // Block Tags operate on their inner range and can have children, IDs, and
  // attributes.
  makeChildBlockTag(tagName: string, context: VisitorContext): TagNodeImpl {
    assert(this.children);
    const tag = new TagNodeImpl("block", tagName, context, this);
    return tag;
  }

  // Line Tags operate on the line they appear in and cannot have children,
  // IDs, or attributes.
  makeChildLineTag(tagName: string, context: VisitorContext): TagNodeImpl {
    assert(this.children);
    return new TagNodeImpl("line", tagName, context, this);
  }

  withErasedBlockTag(
    context: VisitorContext,
    callback: (erasedBlockTag: TagNodeImpl) => void
  ): void {
    assert(this.children);
    // We erase whatever element created the context and add what would have
    // been that element's children to the parent node. This is definitely
    // weird, but only used internally...
    const node = new TagNodeImpl(
      "block",
      "__this_should_not_be_here___please_file_a_bug__",
      context
    );
    callback(node);
    assert(node.children); // Enforced by setting type to "block"
    this.children.push(...node.children);
    this.newlines.push(...node.newlines);
    this.lineComments.push(...node.lineComments);
    this.associatedTokens.push(...node.associatedTokens);
  }

  // The root tag is the root node of a parsed document and contains all
  // other nodes in the document.
  static rootTag(): TagNodeImpl {
    const tag = new TagNodeImpl("block", "__root__", {});
    return tag;
  }

  private constructor(
    type: "block" | "line",
    tagName: string,
    context: VisitorContext,
    parentToAttachTo?: TagNodeImpl
  ) {
    this.type = type;
    if (type === "block") {
      this.children = [];
    }

    this.tagName = tagName;
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

  asBlockTagNode = (): BlockTagNode | undefined => {
    return this.type === "block" ? (this as BlockTagNode) : undefined;
  };

  asLineTagNode = (): LineTagNode | undefined => {
    return this.type === "line" ? (this as LineTagNode) : undefined;
  };
}
