import { validateCommands } from "./processor/validator";
import { COMMAND_PATTERN } from "./parser/lexer/tokens";
import { Document } from "./Document";
import {
  Listener,
  Processor,
  BluehawkFiles,
  ProcessOptions,
} from "./processor/Processor";
import { AnyCommand } from "./commands/Command";
import { ParseResult } from "./parser/ParseResult";
import { ParserStore } from "./parser/ParserStore";
import * as Path from "path";
import { IParser, LanguageSpecification } from "./parser";
import { loadProjectPaths } from "./project";
import { isBinary } from "istextorbinary";
import { System } from "./io/System";
import { OnBinaryFileFunction } from "./OnBinaryFileFunction";
import { logErrorsToConsole, OnErrorFunction } from "./OnErrorFunction";

interface BluehawkConfiguration {
  commands?: AnyCommand[];
  commandAliases?: [string, AnyCommand][];
  languageSpecs?: { [extension: string]: LanguageSpecification };
}

type ParseAndProcessOptions = ProcessOptions & {
  onBinaryFile?: OnBinaryFileFunction;
  onErrors?: OnErrorFunction;
  ignore?: string | string[];
};

const defaultOptions: ParseAndProcessOptions = {
  onErrors: logErrorsToConsole,
};

/**
  The frontend of Bluehawk.
 */
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

  /**
    Register the given command on the processor and validator. This enables
    support for the command under the given name.
   */
  registerCommand(command: AnyCommand, alternateName?: string): void {
    this._processor.registerCommand(command, alternateName);
  }

  /**
    Specify the special patterns for a given language.
   */
  addLanguage = (
    forFileExtension: string | string[],
    languageSpecification: LanguageSpecification
  ): void => {
    this._parserStore.addLanguage(forFileExtension, languageSpecification);
  };

  /**
    Runs through all given source paths to parse and process them.

    @param path - The path or paths to the directory or files to parse and process.
    @param options - The options for parsing and processing.
    */
  parseAndProcess = async (
    path: string | string[],
    optionsIn?: ParseAndProcessOptions
  ): Promise<void> => {
    if (Array.isArray(path)) {
      // If an array of paths is given, recurse for each path in the array.
      await Promise.allSettled(
        path.map(async (rootPath) => {
          return this.parseAndProcess(rootPath, optionsIn);
        })
      );
      return;
    }

    // Ensure default options are set first then override them with incoming
    // options if any
    const options = { ...defaultOptions, ...(optionsIn ?? {}) };

    const { onBinaryFile, onErrors, ignore } = options;

    const filePaths = await loadProjectPaths({
      rootPath: path,
      ignore,
    });

    const promises = filePaths
      .map((filePath) => Path.join(path, filePath))
      .map(async (filePath) => {
        try {
          const blob = await System.fs.readFile(Path.resolve(filePath));
          if (isBinary(filePath, blob)) {
            onBinaryFile && (await onBinaryFile(filePath));
            return;
          }
          const text = blob.toString("utf8");
          const document = new Document({ text, path: filePath });
          const result = this.parse(document);
          if (result.errors.length !== 0) {
            onErrors && onErrors(filePath, result.errors);
            return;
          }
          await this.process(result, options);
        } catch (e) {
          console.error(`Encountered the following error while processing ${filePath}:
${e.stack}

This is probably a bug in Bluehawk. Please send this stack trace (and the contents of ${filePath}, if possible) to the Bluehawk development team at https://github.com/mongodb-university/Bluehawk/issues/new`);
        }
      });

    await Promise.allSettled(promises);
  };

  /**
    Parses the given source file into commands.
   */
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

  /**
    Subscribe to processed documents as they are processed by Bluehawk.
   */
  subscribe(listener: Listener | Listener[]): void {
    if (Array.isArray(listener)) {
      listener.forEach((listener) => this.subscribe(listener));
      return;
    }
    this._processor.subscribe(listener);
  }

  /**
    Executes the commands on the given source. Use [[Bluehawk.subscribe]] to get
    results.
   */
  process = async (
    parseResult: ParseResult,
    processOptions?: ProcessOptions
  ): Promise<BluehawkFiles> => {
    return this._processor.process(parseResult, processOptions);
  };

  /**
    Load the given plugin(s). A plugin is a js file or module that exports a
    `register(bluehawk)` function. `register()` takes this bluehawk instance
    and can register commands, add listeners, etc. The plugin at a given path
    will only be loaded once.
   */
  loadPlugin = async (
    pluginPath: string | string[] | undefined
  ): Promise<void> => {
    if (pluginPath === undefined) {
      return;
    }

    if (Array.isArray(pluginPath)) {
      const promises = pluginPath.map((path) => this.loadPlugin(path));
      await Promise.allSettled(promises);
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
    const absolutePath = Path.isAbsolute(pluginPath)
      ? pluginPath
      : Path.resolve(process.cwd(), pluginPath);
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
