import { CstNode, IToken } from "chevrotain";
import { strict as assert } from "assert";
import { COMMAND_PATTERN } from "../lexer/tokens";
import { RootParser } from "../RootParser";
import { jsonErrorToVisitorError } from "./jsonErrorToVisitorError";
import { innerLocationToOuterLocation } from "./innerOffsetToOuterLocation";
import { BluehawkError } from "../../BluehawkError";
import { Document } from "../../Document";
import { PushParserPayload } from "../lexer/makePushParserTokens";
import { CommandNode, CommandNodeImpl } from "../CommandNode";
import {
  locationFromToken,
  locationAfterToken,
  nextLineAfterToken,
} from "../locationFromToken";
import { extractCommandNamesFromTokens } from "../extractCommandNamesFromTokens";

// See https://sap.github.io/chevrotain/docs/tutorial/step3a_adding_actions$visitor.html

export interface VisitorResult {
  errors: BluehawkError[];
  commandNodes: CommandNode[];
}

export interface IVisitor {
  parser: RootParser;
  visit(node: CstNode, source: Document): VisitorResult;
}

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

  interface BlockCommandContext {
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
    pushParser?: CstNode[];
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

  interface PushParserContext {
    PushParser: IToken[];
    [correspondingPopParserName: string]: IToken[];
  }

  // Tuple passed to visitor methods. All errors go to the top level. Visitor
  // methods operate on the parent node, usually by adding child nodes to the
  // parent.
  interface VisitorContext {
    source: Document;
    parent: CommandNodeImpl;
    errors: BluehawkError[];
  }

  const visitor = new (class CstVisitor extends parser.getBaseCstVisitorConstructor() {
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
          const childContext = (cstNode.children as unknown) as AttributeListContext;
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

    blockCommand(
      context: BlockCommandContext,
      { parent, errors, source }: VisitorContext
    ) {
      assert(parent != null);

      const CommandStart = context.CommandStart[0];
      const CommandEnd = context.CommandEnd[0];

      const [commandName, endCommandName] = extractCommandNamesFromTokens(
        CommandStart,
        CommandEnd
      );

      // Compare start/end name to ensure it is the same command
      if (commandName !== endCommandName) {
        errors.push({
          component: "visitor",
          location: locationFromToken(context.CommandEnd[0]),
          message: `Unexpected ${endCommandName}-end closing ${commandName}-start`,
        });
        return;
      }

      const newNode = parent.makeChildBlockCommand(commandName, context);

      assert(CommandStart.startLine !== undefined);
      assert(CommandStart.startColumn !== undefined);
      assert(CommandEnd.endLine !== undefined);
      assert(CommandEnd.endColumn !== undefined);
      assert(CommandEnd.endOffset !== undefined);
      newNode.range = {
        start: {
          line: CommandStart.startLine,
          column: CommandStart.startColumn,
          offset: CommandStart.startOffset,
        },
        end: {
          line: CommandEnd.endLine,
          column: CommandEnd.endColumn,
          offset: CommandEnd.endOffset,
        },
      };
      newNode.lineRange = {
        start: {
          line: CommandStart.startLine,
          column: 1,
          offset: CommandStart.startOffset - (CommandStart.startColumn - 1),
        },
        end: nextLineAfterToken(CommandEnd, source.text.original),
      };

      assert(context.Newline[0].endLine !== undefined);
      assert(context.Newline[0].endOffset !== undefined);
      assert(context.CommandEnd[0].startColumn !== undefined);
      assert(context.CommandEnd[0].startLine !== undefined);
      if (context.chunk != undefined) {
        newNode.contentRange = {
          start: {
            line: context.Newline[0].endLine + 1,
            column: 1,
            offset: context.Newline[0].endOffset + 1,
          },
          end: {
            line: context.CommandEnd[0].startLine,
            column: 1, // Always end at the beginning of the line with the end command
            offset:
              context.CommandEnd[0].startOffset -
              (context.CommandEnd[0].startColumn - 1),
          },
        };
      }

      this.visit(context.commandAttribute, {
        parent: newNode,
        errors,
        source,
      });
      this.visit(context.chunk, { parent: newNode, errors, source });
    }

    blockComment(
      context: BlockCommentContext,
      { parent, errors, source }: VisitorContext
    ) {
      assert(parent != null);
      // This node (blockComment) should not be included in the final output. We
      // use it to gather child nodes and attach them to the parent node.
      parent.withErasedBlockCommand(context, (erasedBlockCommand) => {
        erasedBlockCommand._context.push("blockComment");
        this.visit(
          [...(context.blockComment ?? []), ...(context.command ?? [])],
          { parent: erasedBlockCommand, errors, source }
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
          ...(context.command ?? []),
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

    command(context: CommandContext, visitorContext: VisitorContext) {
      const { parent, source } = visitorContext;
      assert(parent != null);
      parent.addTokensFromContext(context);
      if (context.blockCommand) {
        assert(!context.Command); // Parser issue!
        this.visit(context.blockCommand, visitorContext);
        return;
      }
      assert(context.Command);
      context.Command.forEach((Command) => {
        const commandPatternResult = COMMAND_PATTERN.exec(Command.image);
        assert(commandPatternResult !== null);
        assert(Command.startLine !== undefined);
        assert(Command.startColumn !== undefined);
        assert(Command.endLine !== undefined);
        assert(Command.endColumn !== undefined);
        assert(Command.endOffset !== undefined);
        const newNode = parent.makeChildLineCommand(
          commandPatternResult[1],
          context
        );
        newNode.range = {
          start: {
            line: Command.startLine,
            column: Command.startColumn,
            offset: Command.startOffset,
          },
          end: {
            line: Command.endLine,
            column: Command.endColumn,
            offset: Command.endOffset,
          },
        };
        newNode.lineRange = {
          start: {
            line: Command.startLine,
            column: 1,
            offset: Command.startOffset - (Command.startColumn - 1),
          },
          end: nextLineAfterToken(Command, source.text.original),
        };
      });
    }

    commandAttribute(
      context: CommandAttributeContext,
      visitorContext: VisitorContext
    ) {
      const { parent } = visitorContext;
      assert(parent != null);
      parent.addTokensFromContext(context);
      const Identifier = context.Identifier;
      const attributeList = context.attributeList;
      if (Identifier != undefined) {
        assert(!attributeList); // parser issue
        assert(Identifier[0].image.length > 0);
        parent.attributes = { id: Identifier[0].image };
      } else if (attributeList !== undefined) {
        assert(!Identifier); // parser issue
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
      const { command } = context;
      if (command === undefined) {
        return;
      }
      parent.withErasedBlockCommand(context, (erasedBlockCommand) => {
        // Any blockCommand that starts in a lineComment by definition MUST be
        // on the same line as the line comment
        erasedBlockCommand._context.push("lineComment");
        this.visit(command, {
          parent: erasedBlockCommand,
          errors,
          source,
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
      parent.children.push(...(result.commandNodes as CommandNodeImpl[]));
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
    const parent = CommandNodeImpl.rootCommand();
    const errors: BluehawkError[] = [];
    visitor.visit([node], { errors, parent, source });
    return {
      errors,
      commandNodes: parent.children ?? [],
    };
  };

  // Return the IVisitor
  return {
    parser,
    visit,
  };
}
