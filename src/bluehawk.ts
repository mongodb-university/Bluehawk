import { makeBlockCommentTokens } from "./parser/lexer/makeBlockCommentTokens";
import { makeLineCommentToken } from "./parser/lexer/makeLineCommentToken";
import { makeCstVisitor, IVisitor } from "./parser/visitor/makeCstVisitor";
import { validateCommands } from "./processor/validator";
import { RootParser } from "./parser/RootParser";
import { COMMAND_PATTERN } from "./parser/lexer/tokens";
import { Document } from "./Document";
import { Listener, Processor, BluehawkFiles } from "./processor/Processor";
import { AnyCommand } from "./commands/Command";
import { ParseResult } from "./parser/ParseResult";
import { strict as assert } from "assert";

// The frontend of Bluehawk
export class Bluehawk {
  // Register the given command on the processor and validator. This enables
  // support for the command under the given name.
  registerCommand(name: string, command: AnyCommand): void {
    this.processor.registerCommand(name, command);
  }

  // Parses the given source file into commands.
  parse = (source: Document): ParseResult => {
    // First, quickly check to see if this even has any commands.
    if (!COMMAND_PATTERN.test(source.text.original)) {
      return {
        errors: [],
        commandNodes: [],
        source,
      };
    }
    if (!this.parsers.has(source.language)) {
      const parser = new RootParser([
        // TODO: map source.language to block/line comment tokens
        ...makeBlockCommentTokens(/\/\*/y, /\*\//y),
        makeLineCommentToken(/\/\/ ?/y),
      ]);
      this.parsers.set(source.language, [parser, makeCstVisitor(parser)]);
    }
    const parserVisitorTuple = this.parsers.get(source.language);
    assert(parserVisitorTuple !== undefined);
    const [parser, visitor] = parserVisitorTuple;
    const parseResult = parser.parse(source.text.original);
    if (parseResult.cst === undefined) {
      return {
        commandNodes: [],
        errors: parseResult.errors,
        source,
      };
    }
    const visitorResult = visitor.visit(parseResult.cst, source);
    const validateErrors = validateCommands(
      visitorResult.commandNodes,
      this.processor.processors
    );
    return {
      errors: [
        ...parseResult.errors,
        ...visitorResult.errors,
        ...validateErrors,
      ],
      commandNodes: visitorResult.commandNodes,
      source,
    };
  };

  // Subscribe to processed documents as they are done processing by Bluehawk.
  subscribe(listener: Listener): void {
    this.processor.subscribe(listener);
  }

  // Executes the commands on the given source. Use subscribe() to get results.
  process = async (parseResult: ParseResult): Promise<BluehawkFiles> => {
    return this.processor.process(parseResult);
  };

  private parsers = new Map<string, [RootParser, IVisitor]>();
  private processor = new Processor();
}
