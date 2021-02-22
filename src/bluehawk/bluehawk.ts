import { validateCommands } from "./processor/validator";
import { COMMAND_PATTERN } from "./parser/lexer/tokens";
import { Document } from "./Document";
import { Listener, Processor, BluehawkFiles } from "./processor/Processor";
import { AnyCommand } from "./commands/Command";
import { ParseResult } from "./parser/ParseResult";
import { ParserStore } from "./parser/ParserStore";
import * as path from "path";
import { IParser, LanguageSpecification } from "./parser";

interface BluehawkConfiguration {
  commands?: AnyCommand[];
  commandAliases?: [string, AnyCommand][];
  languageSpecs?: { [extension: string]: LanguageSpecification };
}

// The frontend of Bluehawk
export class Bluehawk {
  constructor(configuration?: BluehawkConfiguration) {
    if (configuration === undefined) {
      return;
    }

    const { commands, commandAliases, languageSpecs } = configuration;

    if (commands !== undefined) {
      commands.forEach((command) => this.registerCommand(command));
    }

    if (commandAliases !== undefined) {
      commandAliases.forEach((nameCommandPair) =>
        this.registerCommand(nameCommandPair[1], nameCommandPair[0])
      );
    }

    if (languageSpecs !== undefined) {
      Object.entries(languageSpecs).forEach(([extension, specification]) =>
        this.addLanguage(extension, specification)
      );
    }
  }

  // Register the given command on the processor and validator. This enables
  // support for the command under the given name.
  registerCommand(command: AnyCommand, alternateName?: string): void {
    this._processor.registerCommand(command, alternateName);
  }

  // Specify the special patterns for a given language.
  addLanguage = (
    forFileExtension: string | string[],
    languageSpecification: LanguageSpecification
  ): void => {
    this._parserStore.addLanguage(forFileExtension, languageSpecification);
  };

  // Parses the given source file into commands.
  parse = (
    source: Document,
    languageSpecification?: LanguageSpecification
  ): ParseResult => {
    // First, quickly check to see if this even has any commands.
    if (!COMMAND_PATTERN.test(source.text.original)) {
      return {
        errors: [],
        commandNodes: [],
        source,
      };
    }

    let parser: IParser;
    try {
      parser = this._parserStore.getParser(languageSpecification ?? source);
    } catch (error) {
      console.warn(
        `falling back to plaintext parser for ${source.path}: ${error.message}`
      );
      parser = this._parserStore.getDefaultParser();
    }
    const result = parser.parse(source);
    const validateErrors = validateCommands(
      result.commandNodes,
      this._processor.processors
    );
    return {
      ...result,
      errors: [...result.errors, ...validateErrors],
    };
  };

  // Subscribe to processed documents as they are processed by Bluehawk.
  subscribe(listener: Listener | Listener[]): void {
    if (Array.isArray(listener)) {
      listener.forEach((listener) => this.subscribe(listener));
      return;
    }
    this._processor.subscribe(listener);
  }

  // Executes the commands on the given source. Use subscribe() to get results.
  process = async (parseResult: ParseResult): Promise<BluehawkFiles> => {
    return this._processor.process(parseResult);
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

  get processor(): Processor {
    return this._processor;
  }

  private _processor = new Processor();
  private _parserStore = new ParserStore();
  private _loadedPlugins = new Set<string>();
}
