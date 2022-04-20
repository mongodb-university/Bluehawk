import { ConsoleActionReporter } from "./actions/ConsoleActionReporter";
import { ActionReporter } from "./actions/ActionReporter";
import { validateTags } from "./processor/validator";
import { TAG_PATTERN } from "./parser/lexer/tokens";
import { Document } from "./Document";
import {
  Listener,
  Processor,
  BluehawkFiles,
  ProcessOptions,
} from "./processor/Processor";
import { AnyTag } from "./tags/Tag";
import { ParseResult } from "./parser/ParseResult";
import { ParserStore } from "./parser/ParserStore";
import { IParser, LanguageSpecification } from "./parser";
import { loadProjectPaths } from "./project";
import { isBinaryFile } from "isbinaryfile";
import { System } from "./io/System";
import { OnBinaryFileFunction } from "./OnBinaryFileFunction";
import { logErrorsToConsole, OnErrorFunction } from "./OnErrorFunction";

interface BluehawkConfiguration {
  tags?: AnyTag[];
  tagAliases?: [string, AnyTag][];
  languageSpecs?: { [extension: string]: LanguageSpecification };
}

type ParseAndProcessOptions = ProcessOptions & {
  reporter?: ActionReporter;
  onBinaryFile?: OnBinaryFileFunction;
  onErrors?: OnErrorFunction;
  ignore?: string | string[];
};

const defaultOptions: ParseAndProcessOptions = {
  waitForListeners: false,
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

    const { tags, tagAliases, languageSpecs } = configuration;

    if (tags !== undefined) {
      tags.forEach((tag) => this.registerTag(tag));
    }

    if (tagAliases !== undefined) {
      tagAliases.forEach((nameTagPair) =>
        this.registerTag(nameTagPair[1], nameTagPair[0])
      );
    }

    if (languageSpecs !== undefined) {
      Object.entries(languageSpecs).forEach(([extension, specification]) =>
        this.addLanguage(extension, specification)
      );
    }
  }

  /**
    Register the given tag on the processor and validator. This enables
    support for the tag under the given name.
   */
  registerTag(tag: AnyTag, alternateName?: string): void {
    this._processor.registerTag(tag, alternateName);
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
    const reporter = options.reporter ?? new ConsoleActionReporter();

    const filePaths = await loadProjectPaths({
      rootPath: path,
      ignore,
    });

    const promises = filePaths.map(async (filePath) => {
      try {
        const blob = await System.fs.readFile(filePath);
        const stat = await System.fs.lstat(filePath);
        if (await isBinaryFile(blob, stat.size)) {
          reporter.onBinaryFile({ sourcePath: filePath });
          onBinaryFile && (await onBinaryFile(filePath));
          return;
        }
        const text = blob.toString("utf8");
        const document = new Document({ text, path: filePath });
        const result = this.parse(document, { ...options, reporter });
        if (result.errors.length !== 0) {
          reporter.onBluehawkErrors({
            sourcePath: filePath,
            errors: result.errors,
          });
          onErrors && onErrors(filePath, result.errors);
          return;
        }

        reporter.onFileParsed({
          sourcePath: filePath,
          parseResult: result,
        });
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
    Parses the given source file into tags.
   */
  parse = (
    source: Document,
    options?: {
      languageSpecification?: LanguageSpecification;
      reporter?: ActionReporter;
    }
  ): ParseResult => {
    const { reporter, languageSpecification } = options ?? {};
    // First, quickly check to see if this even has any tags.
    if (!TAG_PATTERN.test(source.text.original)) {
      return {
        errors: [],
        tagNodes: [],
        source,
      };
    }

    let parser: IParser;
    try {
      parser = this._parserStore.getParser(languageSpecification ?? source);
    } catch (error) {
      reporter?.onParserNotFound({
        sourcePath: source.path,
        error,
      });
      parser = this._parserStore.getDefaultParser();
    }
    const result = parser.parse(source);
    const validateErrors = validateTags(
      result.tagNodes,
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
    Executes the tags on the given source. Use [[Bluehawk.subscribe]] to get
    results.
   */
  process = async (
    parseResult: ParseResult,
    processOptions?: ProcessOptions
  ): Promise<BluehawkFiles> => {
    return this._processor.process(parseResult, processOptions);
  };

  get processor(): Processor {
    return this._processor;
  }

  private _processor = new Processor();
  private _parserStore = new ParserStore();
}
