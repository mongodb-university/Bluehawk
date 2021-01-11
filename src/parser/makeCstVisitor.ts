import { CstNode, IToken } from "chevrotain";
import { strict as assert } from "assert";
import {
  COMMAND_END_PATTERN,
  COMMAND_PATTERN,
  COMMAND_START_PATTERN,
} from "../lexer/tokens";
import { RootParser } from "./RootParser";
import { jsonErrorToVisitorError } from "./jsonErrorToVisitorError";
import { innerLocationToOuterLocation } from "./innerOffsetToOuterLocation";
import { BluehawkError, BluehawkSource, Location } from "../bluehawk";
import { PushParserPayload } from "../lexer/makePushParserTokens";
import { CommandNode } from "./CommandNode";

// See https://sap.github.io/chevrotain/docs/tutorial/step3a_adding_actions$visitor.html

function locationFromToken(token: IToken): Location {
  return {
    line: token.startLine,
    column: token.startColumn,
    offset: token.startOffset,
  };
}

function locationAfterToken(token: IToken, fullText: string): Location {
  const location = {
    line: token.endLine,
    column: token.endColumn,
    offset: token.endOffset,
  };
  // Ensure the line/column are correctly rolled over if the character is
  // actually a newline
  if (/\r|\n/.test(fullText[location.offset])) {
    location.column = 1;
    location.line += 1;
  }
  return location;
}

function nextLineAfterToken(token: IToken, fullText: string): Location {
  const re = /.*(\r\n|\r|\n)/y;
  re.lastIndex = token.endOffset;
  const match = re.exec(fullText);
  if (!match) {
    // This is a weird case. Must be at EOF.
    return locationAfterToken(token, fullText);
  }
  return {
    column: 1,
    line: token.endLine + 1,
    offset: token.endOffset + match[0].length,
  };
}

export interface VisitorResult {
  errors: BluehawkError[];
  commands: CommandNode[];
}

export type CommandNodeContext =
  | "none"
  | "stringLiteral"
  | "lineComment"
  | "blockComment";

export interface IVisitor {
  parser: RootParser;
  visit(node: CstNode, source: BluehawkSource): VisitorResult;
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
    AttributeListStart: IToken[];
    AttributeListEnd: IToken[];
    LineComment: IToken[];
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
    PopParser: IToken[];
  }

  // Tuple passed to visitor methods. All errors go to the top level. Visitor
  // methods operate on the parent node, usually by adding child nodes to the
  // parent.
  interface VisitorContext {
    source: BluehawkSource;
    parent: CommandNode;
    errors: BluehawkError[];
  }

  return new (class CstVisitor extends parser.getBaseCstVisitorConstructor() {
    parser = parser;

    constructor() {
      super();
      // The "validateVisitor" method is a helper utility which performs static analysis
      // to detect missing or redundant visitor methods
      this.validateVisitor();
    }

    // The entrypoint for the visitor.
    visit(node: CstNode, source: BluehawkSource): VisitorResult {
      const parent = CommandNode.rootCommand();
      const errors = [];
      this.$visit([node], { errors, parent, source });
      return {
        errors,
        commands: parent.children,
      };
    }

    // chevrotain requires helper methods to begin with a token other than
    // [0-9A-z-_] which leaves... $?
    private $visit(
      nodes: CstNode[] | undefined,
      visitorContext: VisitorContext
    ) {
      assert(visitorContext.parent != null);
      if (nodes) {
        nodes.forEach((node) => super.visit(node, visitorContext));
      }
    }

    annotatedText(
      context: AnnotatedTextContext,
      visitorContext: VisitorContext
    ) {
      assert(visitorContext.parent != null);
      // Flatten annotatedText and chunks to one list ordered by appearance in
      // the file and allow each chunk to add to the parent's child list.
      this.$visit(
        (context.chunk ?? []).sort(
          (a, b) => a.location.startOffset - b.location.startOffset
        ),
        visitorContext
      );
    }

    attributeList(
      context: AttributeListContext,
      { parent, errors }: VisitorContext
    ) {
      // ⚠️ This should not recursively visit inner attributeLists
      assert(parent != null);
      const AttributeListStart = context.AttributeListStart[0];
      const AttributeListEnd = context.AttributeListEnd[0];
      assert(AttributeListStart);
      assert(AttributeListEnd);

      parent.addTokensFromContext(context);

      // Retrieve the full text document as the custom payload from the token.
      // Note that AttributeListStart was created with a custom pattern that
      // stores the full text document in the custom payload.
      const { payload } = AttributeListStart;
      const { fullText } = payload as PushParserPayload;
      assert(
        fullText,
        "Unexpected empty payload in AttributeListStart! This is a bug in the parser. Please submit a bug report containing the document that caused this assertion failure."
      );

      // Reminder: substr(startOffset, length) vs. substring(startOffset, endOffset)
      let json = fullText.substring(
        AttributeListStart.startOffset,
        AttributeListEnd.endOffset + 1
      );

      // There may be line comments to strip out
      if (context.LineComment) {
        context.LineComment.forEach((LineComment) => {
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
      }

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
            line: AttributeListStart.startLine,
            column: AttributeListStart.startColumn,
            offset: AttributeListStart.startOffset,
          })
        );
      }
    }

    blockCommand(
      context: BlockCommandContext,
      { parent, errors, source }: VisitorContext
    ) {
      assert(parent != null);

      // Extract the command name ("example") from the
      // ":example-start:"/":example-end:" tokens
      const commandName = COMMAND_START_PATTERN.exec(
        context.CommandStart[0].image
      )[1];
      assert(commandName);

      const newNode = parent.makeChildBlockCommand(commandName, context);

      const CommandStart = context.CommandStart[0];
      const CommandEnd = context.CommandEnd[0];
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

      const endCommandName = COMMAND_END_PATTERN.exec(
        context.CommandEnd[0].image
      )[1];

      // Compare start/end name to ensure it is the same command
      if (newNode.commandName !== endCommandName) {
        errors.push({
          location: locationFromToken(context.CommandEnd[0]),
          message: `Unexpected ${endCommandName}-end closing ${newNode.commandName}-start`,
        });
      }

      this.$visit(context.commandAttribute, {
        parent: newNode,
        errors,
        source,
      });
      this.$visit(context.chunk, { parent: newNode, errors, source });
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
        this.$visit(
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
      this.$visit(
        [
          ...(context.blockComment ?? []),
          ...(context.command ?? []),
          ...(context.lineComment ?? []),
          ...(context.pushParser ?? []),
        ].sort((a, b) => a.location.startOffset - b.location.startOffset),
        visitorContext
      );
    }

    command(context: CommandContext, visitorContext: VisitorContext) {
      const { parent, source } = visitorContext;
      assert(parent != null);
      parent.addTokensFromContext(context);
      if (context.blockCommand) {
        assert(!context.Command); // Parser issue!
        this.$visit(context.blockCommand, visitorContext);
        return;
      }
      assert(context.Command);

      context.Command.forEach((Command) => {
        const newNode = parent.makeChildLineCommand(
          COMMAND_PATTERN.exec(Command.image)[1],
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
      } else if (context.attributeList != undefined) {
        assert(!Identifier); // parser issue
        assert(attributeList.length === 1); // should be impossible to have more than 1 list
        this.$visit(attributeList, visitorContext);
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
        this.$visit(command, {
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

      const visitor = getParser(parserId);
      if (!visitor) {
        errors.push({
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
          location: locationFromToken(PushParser),
          message: `Failed to parse subsection with alternate parser '${parserId}'`,
        });
        return;
      }
      const result = visitor.visit(parseResult.cst, source);
      parent.children.push(...result.commands);
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
}
