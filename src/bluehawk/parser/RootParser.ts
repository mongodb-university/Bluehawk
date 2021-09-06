import { strict as assert } from "assert";
import { CstNode, CstParser, Lexer, TokenType } from "chevrotain";
import { makeLexer } from "./lexer/makeLexer";
import { makeRootMode } from "./lexer/makeRootMode";
import {
  AttributeListStart,
  AttributeListEnd,
  PushParser,
  PopParser,
  BlockCommentStart,
  BlockCommentEnd,
  Command,
  CommandEnd,
  CommandStart,
  Newline,
  Identifier,
  JsonStringLiteral,
  LineComment,
  StringLiteral,
} from "./lexer/tokens";
import { ErrorMessageProvider } from "./ErrorMessageProvider";
import { BluehawkError } from "../BluehawkError";
import { locationFromToken } from "./locationFromToken";
import { extractCommandNamesFromTokens } from "./extractCommandNamesFromTokens";
import { LanguageSpecification } from "./LanguageSpecification";

// See https://sap.github.io/chevrotain/docs/tutorial/step2_parsing.html

// Comment awareness prevents bluehawk from outputting half-commented code
// blocks.
/*

BLUEHAWK SYNTAX

   ╔════════════════════════════════════════╗
   ║  LEGEND                                ║
   ║========================================║▒▒
   ║  starts with capital letter = token    ║▒▒
   ║  starts with lowercase letter = rule   ║▒▒
   ║  : = rule definition                   ║▒▒
   ║  | = or                                ║▒▒
   ║  ( )* = any                            ║▒▒
   ║  ( )? = 0 or 1                         ║▒▒
   ║  ( )+ = 1 or more                      ║▒▒
   ║  _X   = paired token of Category       ║▒▒
   ╚════════════════════════════════════════╝▒▒
     ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒


annotatedText
  : (chunk)*

attributeList
  : AttributeListStart (attributeList | JsonStringLiteral | Newline | LineComment)* AttributeListEnd

blockCommandUncommentedContents
  : BlockCommentEnd Newline (chunk)* BlockCommentStart 

blockCommand
  : CommandStart (commandAttribute)? (BlockCommentEnd*backtrack* | (Newline)?) ((chunk)* | blockCommandUncommentedContents) CommandEnd

blockComment
  : BlockCommentStart (command | LineComment | NewLine | BlockCommentStart†)* BlockCommentEnd

chunk
  : (command | blockComment | lineComment | pushParser | StringLiteral)* (Newline | EOF)††

command
  : blockCommand | Command

commandAttribute
  : (Identifier)+ | attributeList

lineComment
  : LineComment (Command | LineComment | BlockCommentStart | BlockCommentEnd)*

pushParser
  : PushParser_X (pushParser | Newline)* PopParser_X

† = if canNestBlockComments
†† = newline optional in blockCommand
*/

type Rule = (idx?: number) => CstNode;

// While the lexer defines the tokens of the language, the parser defines the
// syntax.
export class RootParser extends CstParser {
  lexer: Lexer;

  annotatedText: Rule = UndefinedRule;
  chunk: Rule = UndefinedRule;
  blockCommand: Rule = UndefinedRule;
  blockCommandUncommentedContents: Rule = UndefinedRule;
  command: Rule = UndefinedRule;
  commandAttribute: Rule = UndefinedRule;
  blockComment: Rule = UndefinedRule;
  lineComment: Rule = UndefinedRule;
  attributeList: Rule = UndefinedRule;
  pushParser: Rule = UndefinedRule;
  languageSpecification?: LanguageSpecification;

  constructor(
    languageTokens: TokenType[],
    languageSpecification?: LanguageSpecification
  ) {
    super(makeRootMode(languageTokens), {
      nodeLocationTracking: "full",
      errorMessageProvider: new ErrorMessageProvider(),
    });
    this.lexer = makeLexer(languageTokens);

    this.languageSpecification = languageSpecification;

    // annotatedText is the root rule and is a series of zero or more chunks
    this.RULE("annotatedText", () => {
      this.MANY(() => this.SUBRULE(this.chunk));
    });

    // A chunk is roughly a line of text or block(s) followed by a newline. We
    // have to distinguish chunk from annotatedText in order to be able to
    // distinguish a LineComment near the end of a blockCommand from a
    // LineComment within a blockCommand's inner chunks.
    this.RULE("chunk", () => {
      this.MANY(() => {
        this.OR([
          { ALT: () => this.SUBRULE(this.command) },
          { ALT: () => this.SUBRULE(this.blockComment) },
          { ALT: () => this.SUBRULE(this.lineComment) },
          { ALT: () => this.SUBRULE(this.pushParser) },
          { ALT: () => this.CONSUME(StringLiteral) },
        ]);
      });
      this.OR1([
        { ALT: () => this.CONSUME(Newline) },
        {
          // Allow for files and lineComment lines to end without a newline.
          GATE: () => {
            const { name } = this.LA(1).tokenType;
            return name === "EOF" || name === CommandEnd.name;
          },
          ALT: () => {
            return;
          },
        },
      ]);
    });

    this.RULE("command", () => {
      this.OR([
        { ALT: () => this.SUBRULE(this.blockCommand) },
        { ALT: () => this.CONSUME(Command) },
      ]);
    });

    this.RULE("blockCommandUncommentedContents", () => {
      this.CONSUME1(BlockCommentEnd);
      this.CONSUME1(Newline);
      this.MANY(() => this.SUBRULE(this.chunk));
      this.CONSUME2(BlockCommentStart);
    });

    this.RULE("blockCommand", () => {
      const startToken = this.CONSUME1(CommandStart);
      this.OPTION1(() => this.SUBRULE(this.commandAttribute));
      this.OR1([
        { ALT: () => this.CONSUME2(Newline) },
        { ALT: () => this.BACKTRACK(() => this.CONSUME(BlockCommentEnd)) },
      ]);
      this.OR2([
        { ALT: () => this.SUBRULE(this.blockCommandUncommentedContents) },
        { ALT: () => this.MANY2(() => this.SUBRULE(this.chunk)) },
      ]);
      const endToken = this.CONSUME3(
        startToken.payload?.endToken ?? CommandEnd
      );

      if (this.RECORDING_PHASE) {
        return;
      }

      // Detect command start/end name mismatch here or we might never get to
      // the semantic stage that can actually tell command names apart. We don't
      // want to have a token for every registered command, so receiving the
      // paired endToken in the payload doesn't quite work out.
      const [startCommandName, endCommandName] = extractCommandNamesFromTokens(
        startToken,
        endToken
      );
      if (startCommandName !== endCommandName) {
        this._bluehawkErrors.push({
          component: "parser",
          location: locationFromToken(endToken),
          message: `Unexpected '${endToken.image}' closing '${startToken.image}'`,
        });
      }
    });

    this.RULE("commandAttribute", () => {
      this.OR([
        { ALT: () => this.AT_LEAST_ONE(() => this.CONSUME(Identifier)) },
        { ALT: () => this.SUBRULE(this.attributeList) },
      ]);
    });

    this.RULE("blockComment", () => {
      const startToken = this.CONSUME(BlockCommentStart);
      this.MANY(() =>
        this.OR([
          { ALT: () => this.SUBRULE(this.command) },
          { ALT: () => this.CONSUME(LineComment) },
          { ALT: () => this.CONSUME(Newline) },
          {
            GATE: () => startToken.payload?.canNest !== false,
            ALT: () => this.CONSUME1(BlockCommentStart),
          },
        ])
      );
      const endToken = startToken.payload?.endToken ?? BlockCommentEnd;
      this.CONSUME(endToken);
    });

    this.RULE("lineComment", () => {
      this.CONSUME(LineComment);
      this.MANY(() =>
        this.OR([
          { ALT: () => this.SUBRULE(this.command) },
          { ALT: () => this.CONSUME1(LineComment) },
          { ALT: () => this.CONSUME(BlockCommentStart) },
          { ALT: () => this.CONSUME(BlockCommentEnd) },
        ])
      );
    });

    this.RULE("attributeList", () => {
      this.CONSUME(AttributeListStart);
      // Simply consume the JSON tokens and allow the JSON.parse() function in
      // the visitor to report errors.
      this.MANY(() => {
        // Consume any token but block comment tokens. We disallow block comment
        // tokens here because it prevents block comment straddling in block
        // commands.
        this.OR([
          { ALT: () => this.CONSUME(LineComment) },
          { ALT: () => this.CONSUME(Newline) },
          { ALT: () => this.CONSUME(JsonStringLiteral) },
          {
            // Handle subobjects
            ALT: () => this.SUBRULE(this.attributeList),
          },
        ]);
      });
      this.CONSUME(AttributeListEnd);
    });

    this.RULE("pushParser", () => {
      // pushParser leaves a block of text unparsed by this parser, allowing the
      // visitor to parse that section with a different parser
      const pushToken = this.CONSUME(PushParser);
      this.MANY(() =>
        this.OR([
          { ALT: () => this.SUBRULE(this.pushParser) },
          { ALT: () => this.CONSUME(Newline) },
        ])
      );
      // Ensure the end token corresponds to the starting token
      const popToken = pushToken.payload?.endToken ?? PopParser;
      this.CONSUME(popToken);
    });

    this.performSelfAnalysis();
  }

  parse(text: string): { cst?: CstNode; errors: BluehawkError[] } {
    this._bluehawkErrors = [];
    const tokens = this.lexer.tokenize(text);
    const tokenErrors = tokens.errors.map(
      (error): BluehawkError => ({
        component: "lexer",
        location: {
          line: error.line,
          column: error.column,
          offset: error.offset,
        },
        message: error.message,
      })
    );
    if (tokenErrors.length !== 0) {
      return {
        cst: undefined,
        errors: tokenErrors,
      };
    }
    this.input = tokens.tokens;
    const cst = this.annotatedText();
    return {
      cst,
      errors: [
        ...tokenErrors,
        ...this._bluehawkErrors,
        ...this.errors.map((error): BluehawkError => {
          // Retrieve the error location from the message because I can't seem
          // to find it on the actual error object.
          const lineColumnOffset = /^([0-9]+):([0-9]+)\(([0-9]+)\)/
            .exec(error?.message)
            ?.map((result) => parseInt(result)) ?? [-1, -1, -1, -1];
          const [, line, column, offset] = lineColumnOffset;
          return {
            component: "parser",
            location: {
              line,
              column,
              offset,
            },
            message: error.message,
          };
        }),
      ],
    };
  }

  // Private channel returned from parse() for early warnings that can be more
  // helpful than normal parser errors.
  private _bluehawkErrors: BluehawkError[] = [];
}

// Chevrotain assigns the rules after construction. Initializing rule properties
// with this rule quashes the "Property 'annotatedText' has no initializer and
// is not definitely assigned in the constructor." error.
function UndefinedRule(): CstNode {
  assert(false);
}
