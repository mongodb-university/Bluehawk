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
import * as path from "path";
import * as fs from "fs";
import { isBinary } from "istextorbinary";

// The frontend of Bluehawk
export class Bluehawk {
  // Register the given command on the processor and validator. This enables
  // support for the command under the given name.
  registerCommand<Command extends AnyCommand>(
    name: string,
    command: Command
  ): void {
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

  // Parse the document at the given path.
  loadFileAndParse = async (sourcePath: string): Promise<ParseResult> => {
    return new Promise((resolve, reject) => {
      if (isBinary(sourcePath)) {
        return reject(
          new Error(
            `Binary file encountered at path '${sourcePath}'. Bluehawk does not parse binary files.`
          )
        );
      }

      const language = path.extname(sourcePath);
      fs.readFile(path.resolve(sourcePath), "utf8", (error, text) => {
        if (error) {
          return reject(error);
        }
        const document = new Document({ text, language, path: sourcePath });
        try {
          resolve(this.parse(document));
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  // Subscribe to processed documents as they are processed by Bluehawk.
  subscribe(listener: Listener | Listener[]): void {
    if (Array.isArray(listener)) {
      listener.forEach((listener) => this.subscribe(listener));
      return;
    }
    this.processor.subscribe(listener);
  }

  // Executes the commands on the given source. Use subscribe() to get results.
  process = async (parseResult: ParseResult): Promise<BluehawkFiles> => {
    return this.processor.process(parseResult);
  };

  // Load the given plugin(s). A plugin is a js file or module that exports a
  // `register(bluehawk)` function. `register()` takes this bluehawk instance
  // and can register commands, add listeners, etc. The plugin at a given path
  // will only be loaded once.
  loadPlugin = async (
    pluginPath: string | string[] | undefined
  ): Promise<void> => {
    if (pluginPath === undefined) {
      return;
    }

    if (Array.isArray(pluginPath)) {
      const promises = pluginPath.map((path) => this.loadPlugin(path));
      await Promise.all(promises);
      return;
    }

    if (typeof pluginPath !== "string") {
      console.warn(
        `Invalid argument to loadPlugin: ${pluginPath} (typeof == ${typeof pluginPath}`
      );
      return;
    }

    // Check if the plugin has already been loaded
    if (this._loadedPlugins.has(pluginPath)) {
      console.warn(`Skipping already loaded plugin: ${pluginPath}`);
      return;
    }

    // Convert relative path (from user's cwd) to absolute path -- as import()
    // expects relative paths from Bluehawk bin directory
    const absolutePath = path.isAbsolute(pluginPath)
      ? pluginPath
      : path.resolve(process.cwd(), pluginPath);
    const plugin = await import(absolutePath);
    await plugin.register(this);
    this._loadedPlugins.add(pluginPath);
  };

  private parsers = new Map<string, [RootParser, IVisitor]>();
  private processor = new Processor();
  private _loadedPlugins = new Set<string>();
}
