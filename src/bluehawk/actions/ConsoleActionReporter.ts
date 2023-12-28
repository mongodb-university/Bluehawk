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

console.log(`
${chalk.white.bgBlue.bold(
  `            
  Bluehawk  
            `
)}`);

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
  }

  get errorCount(): number {
    return this._count.errors;
  }

  onBinaryFile = (event: FileEvent): void => {
    ++this._count.binaryFiles;
    if (this.logLevel >= LogLevel.Info) {
      console.log(
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
      console.log(`
Run ${chalk.blue.bold("config")} file: ${path.relative(
        __dirname,
        event.inputPath
      )}`);
    } else if (this.logLevel >= LogLevel.Info) {
      console.log(
        `  ${chalk.magenta("▕")} parsed file: ${path.relative(
          __dirname,
          event.inputPath
        )}`
      );
    }
  };

  onFileWritten = (event: FileWrittenEvent): void => {
    ++this._count.filesWritten;
    if (this.logLevel >= LogLevel.Info) {
      console.log(
        `  ${chalk.magenta("▕")} wrote ${chalk.cyan.bold(event.type)} file:
    ${chalk.cyan("▕")} Input : ${path.relative(__dirname, event.inputPath)}
    ${chalk.cyan("▕")} Output: ${path.relative(__dirname, event.outputPath)}`
      );
    }
  };

  onStatesFound = (event: StatesFoundEvent): void => {
    if (this.logLevel >= LogLevel.Info) {
      console.log(`found states: ${event.statesFound.join(", ")}`);
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
        )} on ${path.relative(__dirname, event.inputPath)}:
        ${event.errors
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
        `${chalk.blue("▕")} process ${chalk.magenta.bold(event.name)} command`
      );
    }
  };

  printSummary = (): void => {
    const { actions, binaryFiles, errors, textFiles, filesWritten } =
      this._count;
    const success = chalk.blue("✓");
    const failure = chalk.red("x");
    const noResult = chalk.yellow("-");
    const binaryMarker = binaryFiles == 0 ? noResult : success;
    const textFilesMarker = textFiles == 0 ? noResult : success;
    const errorsMarker = errors > 0 ? failure : success;
    const filesWrittenMarker = filesWritten == 0 ? noResult : success;

    if (actions) {
      console.log(`
${chalk.white.bgBlue(" Bluehawk summary: ")}
${success} ran ${chalk.cyan(actions)} config actions
${binaryMarker} processed ${chalk.cyan(binaryFiles)} binary files
${textFilesMarker} parsed ${chalk.cyan(textFiles)} text files
${errorsMarker} logged ${chalk.cyan(errors)} errors
${filesWrittenMarker} wrote ${chalk.cyan(filesWritten)} files

  Number of files processed: ${chalk.cyan(binaryFiles + textFiles)}
`);
    } else {
      console.log(`
${chalk.white.bgBlue(" Bluehawk summary: ")}
${binaryMarker} processed ${chalk.cyan(binaryFiles)} binary files
${textFilesMarker} parsed ${chalk.cyan(textFiles)} text files
${errorsMarker} logged ${chalk.cyan(errors)} errors
${filesWrittenMarker} wrote ${chalk.cyan(filesWritten)} files

  Number of files processed: ${chalk.cyan(binaryFiles + textFiles)}
`);
    }
  };
}
