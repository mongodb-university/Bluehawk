import { CstNode, IToken } from "chevrotain";
import { strict as assert } from "assert";
import { TAG_PATTERN } from "../lexer/tokens";
import { RootParser } from "../RootParser";
import { jsonErrorToVisitorError } from "./jsonErrorToVisitorError";
import { innerLocationToOuterLocation } from "./innerOffsetToOuterLocation";
import { BluehawkError } from "../../BluehawkError";
import { Document } from "../../Document";
import { PushParserPayload } from "../lexer/makePushParserTokens";
import { AnyTagNode, TagNodeImpl, LineTagNode } from "../TagNode";
import {
  locationFromToken,
  locationAfterToken,
  nextLineAfterToken,
} from "../locationFromToken";
import { extractTagNamesFromTokens } from "../extractTagNamesFromTokens";

// See https://sap.github.io/chevrotain/docs/tutorial/step3a_adding_actions$visitor.html

export interface VisitorResult {
  errors: BluehawkError[];
  tagNodes: AnyTagNode[];
}

export interface IVisitor {
  parser: RootParser;
  visit(node: CstNode, source: Document): VisitorResult;
}

// Returns true if the given earlier token is "associated" with the given later
// token. A token is considered associated if it appears immediately before the
// next token.
const isAssociated = (earlierToken: IToken, laterToken: IToken) => {
  const { startColumn } = laterToken;
  assert(startColumn !== undefined);
  return (
    earlierToken.endLine === laterToken.startLine &&
    earlierToken.endColumn === startColumn - 1
  );
};

// While the lexer defines the tokens (words) and the parser defines the syntax,
// the CstVisitor defines the semantics of the language.
export function makeCstVisitor(
  parser: RootParser,
  getParser?: (parserId: string) => IVisitor | undefined
): IVisitor {
  // The following context interfaces (should) match the corresponding parser
  // rule. Subrules appear as CstNode[]. Tokens appear as IToken[]. If the
  // element is optional in the syntax, it's TypeScript optional™ in the context
  // interface.

  // For whatever reason, chevrotain always provides *arrays* of CstNodes and
  // ITokens, even if you know there can only be one.
  interface AnnotatedTextContext {
    chunk?: CstNode[];
  }

  interface AttributeListContext {
    AttributeListStart?: IToken[];
    AttributeListEnd?: IToken[];
    attributeList?: CstNode[];
    LineComment?: IToken[];
  }

  interface BlockTagUncommentedContentsContext {
    Newline: IToken[];
    chunk: CstNode[];
  }

  interface BlockTagContext {
    TagStart: IToken[];
    tagAttribute?: CstNode[];
    Newline?: IToken[];
    chunk?: CstNode[];
    blockTagUncommentedContents?: CstNode[];
    TagEnd: IToken[];
  }

  interface BlockCommentContext {
    BlockCommentStart: IToken[];
    tag?: CstNode[];
    LineComment?: IToken[];
    Newline?: IToken[];
    blockComment?: CstNode[];
    BlockCommentEnd: IToken[];
  }

  interface ChunkContext {
    blockComment?: CstNode[];
    tag?: CstNode[];
    lineComment?: CstNode[];
    pushParser?: CstNode[];
    Newline: IToken[];
  }

  interface TagContext {
    Tag?: IToken[];
    blockTag?: CstNode[];
  }

  interface TagAttributeContext {
    Identifier?: IToken[];
    attributeList?: CstNode[];
  }

  interface LineCommentContext {
    LineComment: IToken[];
    tag?: CstNode[];
    BlockCommentStart?: IToken[];
    BlockCommentEnd?: IToken[];
  }

  interface PushParserContext {
    PushParser: IToken[];
    [correspondingPopParserName: string]: IToken[];
  }

  // Tuple passed to visitor methods. All errors go to the top level. Visitor
  // methods operate on the parent node, usually by adding child nodes to the
  // parent.
  interface VisitorContext {
    source: Document;
    parent: TagNodeImpl;
    errors: BluehawkError[];
    lineComments?: IToken[];
  }

  const visitor =
    new (class CstVisitor extends parser.getBaseCstVisitorConstructor() {
      constructor() {
        super();
        // The "validateVisitor" method is a helper utility which performs static analysis
        // to detect missing or redundant visitor methods
        this.validateVisitor();
      }

      visit(nodes?: CstNode[] | CstNode, visitorContext?: VisitorContext) {
        assert(visitorContext?.parent !== undefined);
        if (Array.isArray(nodes)) {
          nodes.forEach((node) => super.visit(node, visitorContext));
        } else if (nodes !== undefined) {
          super.visit(nodes, visitorContext);
        }
      }

      annotatedText(
        context: AnnotatedTextContext,
        visitorContext: VisitorContext
      ) {
        assert(visitorContext.parent != null);
        // Flatten annotatedText and chunks to one list ordered by appearance in
        // the file and allow each chunk to add to the parent's child list.
        this.visit(
          (context.chunk ?? []).sort(
            (a, b) =>
              (a.location?.startOffset ?? 0) - (b.location?.startOffset ?? 0)
          ),
          visitorContext
        );
      }

      attributeList(
        context: AttributeListContext,
        { parent, errors }: VisitorContext
      ) {
        assert(parent != null);

        // ⚠️ This should not recursively $visit() inner attributeLists to avoid
        // repeated parsing of JSON. Manually flatten the tree to extract tokens.
        const lineComments = context.LineComment ?? [];
        const visitInnerAttributeList = (attributeList?: CstNode[]) => {
          if (attributeList === undefined) {
            return;
          }
          attributeList.forEach((cstNode) => {
            // ⚠️ Here be dragons -- `CstChildrenDictionary` _might_ be equivalent
            // to AttributeListContext. If the syntax changed, this would not
            // notice automatically. Check carefully.
            const childContext =
              cstNode.children as unknown as AttributeListContext;
            parent.addTokensFromContext(childContext);
            lineComments.push(...(childContext.LineComment ?? []));
            visitInnerAttributeList(childContext.attributeList);
          });
        };
        visitInnerAttributeList(context.attributeList);
        parent.addTokensFromContext(context);

        assert(context.AttributeListStart !== undefined);
        assert(context.AttributeListEnd !== undefined);
        const AttributeListStart = context.AttributeListStart[0];
        const AttributeListEnd = context.AttributeListEnd[0];
        assert(AttributeListStart);
        assert(AttributeListEnd);

        // Retrieve the full text document as the custom payload from the token.
        // Note that AttributeListStart was created with a custom pattern that
        // stores the full text document in the custom payload.
        const { payload } = AttributeListStart;
        const { fullText } = payload as PushParserPayload;
        assert(
          fullText,
          "Unexpected empty payload in AttributeListStart! This is a bug in the parser. Please submit a bug report containing the document that caused this assertion failure."
        );

        assert(AttributeListEnd.endOffset !== undefined);

        // Reminder: substr(startOffset, length) vs. substring(startOffset, endOffset)
        let json = fullText.substring(
          AttributeListStart.startOffset,
          AttributeListEnd.endOffset + 1
        );

        // There may be line comments to strip out
        lineComments.forEach((LineComment) => {
          assert(LineComment.endOffset !== undefined);
          // Make offsets relative to the JSON string, not the overall document
          const startOffset =
            LineComment.startOffset - AttributeListStart.startOffset;
          const endOffset =
            LineComment.endOffset - AttributeListStart.startOffset; // [sic]
          // Replace line comments with harmless spaces
          json =
            json.substring(0, startOffset) +
            " ".repeat(LineComment.image.length) +
            json.substring(endOffset + 1);
        });

        try {
          const object = JSON.parse(json);
          // The following should be impossible in the parser.
          assert(
            typeof object === "object" && object !== null,
            "attributeList is not an object. This is a bug in the parser. Please submit a bug report containing the document that caused this assertion failure."
          );
          parent.attributes = object;
        } catch (error) {
          errors.push(
            jsonErrorToVisitorError(error, json, {
              line: AttributeListStart.startLine ?? -1,
              column: AttributeListStart.startColumn ?? -1,
              offset: AttributeListStart.startOffset ?? -1,
            })
          );
        }
      }

      blockTag(
        context: BlockTagContext,
        { parent, errors, source, lineComments }: VisitorContext
      ) {
        assert(parent != null);

        const TagStart = context.TagStart[0];
        const TagEnd = context.TagEnd[0];

        const [tagName, endTagName] = extractTagNamesFromTokens(
          TagStart,
          TagEnd
        );

        // Compare start/end name to ensure it is the same tag
        if (tagName !== endTagName) {
          errors.push({
            component: "visitor",
            location: locationFromToken(context.TagEnd[0]),
            message: `Unexpected ${endTagName}-end closing ${tagName}-start`,
          });
          return;
        }

        const newNode = parent.makeChildBlockTag(tagName, context);

        assert(TagStart.startLine !== undefined);
        assert(TagStart.startColumn !== undefined);
        assert(TagEnd.endLine !== undefined);
        assert(TagEnd.endColumn !== undefined);
        assert(TagEnd.endOffset !== undefined);
        newNode.range = {
          start: {
            line: TagStart.startLine,
            column: TagStart.startColumn,
            offset: TagStart.startOffset,
          },
          end: {
            line: TagEnd.endLine,
            column: TagEnd.endColumn,
            offset: TagEnd.endOffset,
          },
        };
        newNode.lineRange = {
          start: {
            line: TagStart.startLine,
            column: 1,
            offset: TagStart.startOffset - (TagStart.startColumn - 1),
          },
          end: nextLineAfterToken(TagEnd, source.text.original),
        };

        if (lineComments !== undefined) {
          newNode.associatedTokens.push(
            ...lineComments.filter(
              (lineComment) =>
                lineComment.startOffset < TagStart.startOffset &&
                isAssociated(lineComment, TagStart)
            )
          );
        }
        assert(context.TagStart[0].endOffset !== undefined);
        assert(context.TagStart[0].endLine !== undefined);
        assert(context.TagEnd[0].startColumn !== undefined);
        assert(context.TagEnd[0].startLine !== undefined);

        let lineStart: number;
        let offsetStart: number;
        if (
          context.Newline !== undefined &&
          context.Newline[0] !== undefined &&
          context.Newline[0].endLine !== undefined &&
          context.Newline[0].endOffset !== undefined
        ) {
          lineStart = context.Newline[0].endLine + 1;
          offsetStart = context.Newline[0].endOffset + 1;
        } else {
          // start and end offsets for block tags with uncommented contents
          assert(context.blockTagUncommentedContents !== undefined);
          const NewLineTokenArr = context.blockTagUncommentedContents[0]
            .children.Newline as IToken[];
          lineStart = context.TagStart[0].endLine + 1;
          offsetStart = NewLineTokenArr[0].startOffset + 1;
        }

        if (
          context.chunk != undefined ||
          context.blockTagUncommentedContents != undefined
        ) {
          newNode.contentRange = {
            start: {
              line: lineStart,
              column: 1,
              offset: offsetStart,
            },
            end: {
              line: context.TagEnd[0].startLine,
              column: 1, // Always end at the beginning of the line with the end tag
              offset:
                context.TagEnd[0].startOffset -
                (context.TagEnd[0].startColumn - 1),
            },
          };
        }

        this.visit(context.tagAttribute, {
          parent: newNode,
          errors,
          source,
        });

        this.visit(context.blockTagUncommentedContents ?? context.chunk, {
          parent: newNode,
          errors,
          source,
        });

        // Find any line comment tokens associated with the tag end token
        newNode.associatedTokens.push(
          ...newNode.lineComments.filter((lineComment) =>
            isAssociated(lineComment, TagEnd)
          )
        );
      }

      blockTagUncommentedContents(
        context: BlockTagUncommentedContentsContext,
        { parent, errors, source }: VisitorContext
      ) {
        this.visit(context.chunk, { parent, errors, source });
      }

      blockComment(
        context: BlockCommentContext,
        { parent, errors, source }: VisitorContext
      ) {
        assert(parent != null);
        // This node (blockComment) should not be included in the final output. We
        // use it to gather child nodes and attach them to the parent node.
        parent.withErasedBlockTag(context, (erasedBlockTag) => {
          erasedBlockTag._context.push("blockComment");
          this.visit(
            [...(context.blockComment ?? []), ...(context.tag ?? [])],
            { parent: erasedBlockTag, errors, source }
          );
        });
      }

      chunk(context: ChunkContext, visitorContext: VisitorContext) {
        const { parent } = visitorContext;
        assert(parent != null);
        parent.addTokensFromContext(context);

        // Like annotatedText, merge all child nodes into a list of children
        // attached to the parent node, ordered by their appearance in the
        // document.
        this.visit(
          [
            ...(context.blockComment ?? []),
            ...(context.tag ?? []),
            ...(context.lineComment ?? []),
            ...(context.pushParser ?? []),
          ].sort((a, b) => {
            assert(a.location !== undefined);
            assert(b.location !== undefined);
            return a.location.startOffset - b.location.startOffset;
          }),
          visitorContext
        );
      }

      tag(context: TagContext, visitorContext: VisitorContext) {
        const { parent, source, lineComments } = visitorContext;
        assert(parent != null);
        parent.addTokensFromContext(context);
        if (context.blockTag) {
          assert(!context.Tag); // Parser issue!
          this.visit(context.blockTag, visitorContext);
          return;
        }
        assert(context.Tag);
        context.Tag.forEach((Tag) => {
          const tagPatternResult = TAG_PATTERN.exec(Tag.image);
          assert(tagPatternResult !== null);
          assert(Tag.startLine !== undefined);
          assert(Tag.startColumn !== undefined);
          assert(Tag.endLine !== undefined);
          assert(Tag.endColumn !== undefined);
          assert(Tag.endOffset !== undefined);
          const newNode = parent.makeChildLineTag(tagPatternResult[1], context);
          newNode.range = {
            start: {
              line: Tag.startLine,
              column: Tag.startColumn,
              offset: Tag.startOffset,
            },
            end: {
              line: Tag.endLine,
              column: Tag.endColumn,
              offset: Tag.endOffset,
            },
          };
          newNode.lineRange = {
            start: {
              line: Tag.startLine,
              column: 1,
              offset: Tag.startOffset - (Tag.startColumn - 1),
            },
            end: nextLineAfterToken(Tag, source.text.original),
          };
          if (lineComments !== undefined) {
            newNode.associatedTokens.push(
              ...lineComments.filter((lineComment) =>
                isAssociated(lineComment, Tag)
              )
            );
          }
        });
      }

      tagAttribute(
        context: TagAttributeContext,
        visitorContext: VisitorContext
      ) {
        const { parent } = visitorContext;
        assert(parent != null);
        parent.addTokensFromContext(context);
        const Identifier = context.Identifier;
        const attributeList = context.attributeList;
        if (Identifier != undefined && Identifier.length != 0) {
          assert(!attributeList); // parser issue
          parent.attributes = {
            id: Identifier.map((identifier) => identifier.image),
          };
        } else if (attributeList !== undefined) {
          assert(!Identifier);
          assert(attributeList.length === 1); // should be impossible to have more than 1 list
          this.visit(attributeList, visitorContext);
        }
      }

      lineComment(
        context: LineCommentContext,
        { parent, errors, source }: VisitorContext
      ) {
        assert(parent != null);
        parent.addTokensFromContext(context);
        const { tag } = context;
        if (tag === undefined) {
          return;
        }
        parent.withErasedBlockTag(context, (erasedBlockTag) => {
          // Any blockTag that starts in a lineComment by definition MUST be
          // on the same line as the line comment
          erasedBlockTag._context.push("lineComment");
          this.visit(tag, {
            parent: erasedBlockTag,
            errors,
            source,
            lineComments: context.LineComment,
          });
        });
      }

      pushParser(
        context: PushParserContext,
        { parent, errors, source }: VisitorContext
      ) {
        // ⚠️ This should not recursively visit inner pushParsers
        assert(parent != null);
        parent.addTokensFromContext(context);

        const PushParser = context.PushParser[0];
        assert(PushParser);

        // Retrieve the full text document as the custom payload from the token.
        // Note that AttributeListStart was created with a custom pattern that
        // stores the full text document in the custom payload.
        const { payload } = PushParser;
        const {
          fullText,
          parserId,
          includePushTokenInSubstring,
          includePopTokenInSubstring,
          endToken,
        } = payload as PushParserPayload;

        assert(
          fullText,
          "Unexpected empty payload in AttributeListStart! This is a bug in the parser. Please submit a bug report containing the document that caused this assertion failure."
        );

        // We need to know exactly which PopParser token we are looking for.
        const PopParser = context[endToken.name][0];
        assert(PopParser);
        assert(PopParser.endOffset);

        const startLocation = includePushTokenInSubstring
          ? locationFromToken(PushParser)
          : locationAfterToken(PushParser, fullText);

        // Reminder: substr(startOffset, length) vs. substring(startOffset, endOffset)
        const substring = fullText.substring(
          startLocation.offset,
          includePopTokenInSubstring
            ? PopParser.endOffset + 1
            : PopParser.startOffset
        );

        assert(getParser !== undefined);
        const visitor = getParser(parserId);
        if (!visitor) {
          errors.push({
            component: "visitor",
            location: startLocation,
            message: `Parser '${parserId}' not found`,
          });
          return;
        }

        const { parser } = visitor;
        const parseResult = parser.parse(substring);
        parseResult.errors.forEach((error) =>
          errors.push({
            ...error,
            location: innerLocationToOuterLocation(
              error.location,
              substring,
              startLocation
            ),
          })
        );

        if (!parseResult.cst) {
          errors.push({
            component: "visitor",
            location: locationFromToken(PushParser),
            message: `Failed to parse subsection with alternate parser '${parserId}'`,
          });
          return;
        }
        const result = visitor.visit(parseResult.cst, source);
        assert(parent.children !== undefined);
        parent.children.push(...(result.tagNodes as TagNodeImpl[]));
        result.errors.forEach((error) =>
          errors.push({
            ...error,
            location: innerLocationToOuterLocation(
              error.location,
              substring,
              startLocation
            ),
          })
        );
      }
    })();

  // The entrypoint for the visitor. Chevrotain's validateVisitor() requires
  // that all methods correspond to a grammar rule, so this helper must be
  // external.
  const visit = (node: CstNode, source: Document): VisitorResult => {
    const parent = TagNodeImpl.rootTag();
    const errors: BluehawkError[] = [];
    visitor.visit([node], { errors, parent, source });
    return {
      errors,
      tagNodes: (parent.children ?? []).map(
        (child) => child.asBlockTagNode() ?? (child as LineTagNode)
      ),
    };
  };

  // Return the IVisitor
  return {
    parser,
    visit,
  };
}
