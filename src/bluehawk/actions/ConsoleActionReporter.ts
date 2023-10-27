import {
  ActionReporter,
  ActionProcessedEvent,
  BluehawkErrorsEvent,
  FileErrorEvent,
  FileEvent,
  FileParsedEvent,
  FileWrittenEvent,
  IdsUnusedEvent,
  LogLevel,
  ParserNotFoundEvent,
  StateNotFoundEvent,
  StatesFoundEvent,
  WriteFailedEvent,
} from "./ActionReporter";

import * as path from "path";

import chalk from "chalk";

const log = console.log;

export class ConsoleActionReporter implements ActionReporter {
  _count = {
    actions: 0,
    binaryFiles: 0,
    textFiles: 0,
    filesWritten: 0,
    errors: 0,
  };

  logLevel: LogLevel = LogLevel.Info;

  constructor(args?: { logLevel?: LogLevel }) {
    if (args?.logLevel !== undefined) {
      this.logLevel = args.logLevel;
    }

    log(`
${chalk.white.bgBlue.bold(
  `            
  Bluehawk  
            `
)}`);
  }

  get errorCount(): number {
    return this._count.errors;
  }

  onBinaryFile = (event: FileEvent): void => {
    ++this._count.binaryFiles;
    if (this.logLevel >= LogLevel.Info) {
      log(
        `found binary file: ${path.relative(
          __dirname,
          path.dirname(event.inputPath)
        )}`
      );
    }
  };

  onFileParsed = (event: FileParsedEvent): void => {
    ++this._count.textFiles;
    if (this.logLevel >= LogLevel.Info && event.isConfig) {
      log(`
Run ${chalk.blue.bold("config")} file: ${path.relative(
        __dirname,
        path.dirname(event.inputPath)
      )}`);
    } else if (this.logLevel >= LogLevel.Info) {
      log(
        `    ${chalk.magenta("▕")} parsed file: ${path.relative(
          __dirname,
          path.dirname(event.inputPath)
        )}`
      );
    }
  };

  onFileWritten = (event: FileWrittenEvent): void => {
    ++this._count.filesWritten;
    if (this.logLevel >= LogLevel.Info) {
      log(
        `    ${chalk.magenta("▕")} wrote ${chalk.cyan.bold(event.type)} file:
      ${chalk.cyan("▕")} Input : ${path.relative(
          __dirname,
          path.dirname(event.inputPath)
        )}
      ${chalk.cyan("▕")} Output: ${path.relative(
          __dirname,
          path.dirname(event.outputPath)
        )}`
      );
    }
  };

  onStatesFound = (event: StatesFoundEvent): void => {
    if (this.logLevel >= LogLevel.Info) {
      log(`found states: ${event.statesFound.join(", ")}`);
    }
  };

  onStateNotFound = (event: StateNotFoundEvent): void => {
    if (this.logLevel >= LogLevel.Warning) {
      console.warn(`state not found: ${event.state}`);
    }
  };

  onIdsUnused = (event: IdsUnusedEvent): void => {
    if (this.logLevel >= LogLevel.Warning) {
      console.warn(`ids not used: ${event.ids.join(", ")}`);
    }
  };

  onParserNotFound = (event: ParserNotFoundEvent): void => {
    if (this.logLevel >= LogLevel.Warning) {
      console.warn(
        `parser not found for file ${path.relative(
          __dirname,
          path.dirname(event.inputPath)
        )}: ${event.error.message}`
      );
    }
  };

  onFileError = (event: FileErrorEvent): void => {
    ++this._count.errors;
    if (this.logLevel >= LogLevel.Error) {
      console.error(
        `   ${chalk.red.bold("!")} file ${chalk.red.bold(
          "error"
        )}: ${path.relative(__dirname, path.dirname(event.inputPath))}: ${
          event.error.message
        }`
      );
    }
  };

  onWriteFailed = (event: WriteFailedEvent): void => {
    ++this._count.errors;
    if (this.logLevel >= LogLevel.Error) {
      console.error(
        `   ${chalk.red.bold("!")} ${chalk.red.bold(
          "failed"
        )} to write file ${path.relative(
          __dirname,
          path.dirname(event.inputPath)
        )} -> ${path.relative(__dirname, path.dirname(event.outputPath))}: ${
          event.error.message
        }`
      );
    }
  };

  onBluehawkErrors = (event: BluehawkErrorsEvent): void => {
    ++this._count.textFiles;
    this._count.errors += event.errors.length;
    if (this.logLevel >= LogLevel.Error) {
      console.error(
        `   ${chalk.red.bold("!")} bluehawk ${chalk.red.bold(
          "errors"
        )} on ${path.relative(
          __dirname,
          path.dirname(event.inputPath)
        )}:\n${event.errors
          .map((error) => {
            return `(${error.component}) Line ${error.location.line}:${error.location.column} - ${error.message}`;
          })
          .join("\n")}`
      );
    }
  };

  onActionProcessed = (event: ActionProcessedEvent): void => {
    ++this._count.actions;

    if (this.logLevel >= LogLevel.Info) {
      console.warn(
        `${chalk.blue("▕")}  process ${chalk.magenta.bold(event.name)} command`
      );
    }
  };

  printSummary = (): void => {
    const { actions, binaryFiles, errors, textFiles, filesWritten } =
      this._count;

    if (actions) {
      log(`Processed ${binaryFiles + textFiles} files:
- ${actions} config actions
- ${binaryFiles} binary files
- ${textFiles} text files
- ${errors} errors
- ${filesWritten} files written`);
    } else {
      log(`Processed ${binaryFiles + textFiles} files:
- ${binaryFiles} binary files
- ${textFiles} text files
- ${errors} errors
- ${filesWritten} files written`);
    }
  };
}
