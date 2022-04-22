import {
  ActionReporter,
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

export class ConsoleActionReporter implements ActionReporter {
  _count = {
    binaryFiles: 0,
    textFiles: 0,
    filesWritten: 0,
    errors: 0,
  };

  logLevel: LogLevel = LogLevel.Info;

  get errorCount(): number {
    return this._count.errors;
  }

  onBinaryFile(event: FileEvent): void {
    ++this._count.binaryFiles;
    if (this.logLevel <= LogLevel.Info) {
      console.log(`found binary file: ${event.sourcePath}`);
    }
  }
  onFileParsed(event: FileParsedEvent): void {
    ++this._count.textFiles;
    if (this.logLevel <= LogLevel.Info) {
      console.log(`parsed file: ${event.sourcePath}`);
    }
  }
  onFileWritten(event: FileWrittenEvent): void {
    ++this._count.filesWritten;
    if (this.logLevel <= LogLevel.Info) {
      console.log(
        `wrote ${event.type} file based on ${event.sourcePath} -> ${event.destinationPath}`
      );
    }
  }
  onStatesFound(event: StatesFoundEvent): void {
    if (this.logLevel <= LogLevel.Info) {
      console.log(`found states: ${event.statesFound.join(", ")}`);
    }
  }
  onStateNotFound(event: StateNotFoundEvent): void {
    if (this.logLevel <= LogLevel.Warning) {
      console.warn(`state not found: ${event.state}`);
    }
  }
  onIdsUnused(event: IdsUnusedEvent): void {
    if (this.logLevel <= LogLevel.Warning) {
      console.warn(`ids not used: ${event.ids.join(", ")}`);
    }
  }
  onParserNotFound(event: ParserNotFoundEvent): void {
    if (this.logLevel <= LogLevel.Warning) {
      console.warn(
        `parser not found for file ${event.sourcePath}: ${event.error.message}`
      );
    }
  }
  onFileError(event: FileErrorEvent): void {
    ++this._count.errors;
    if (this.logLevel <= LogLevel.Error) {
      console.error(`file error: ${event.sourcePath}: ${event.error.message}`);
    }
  }
  onWriteFailed(event: WriteFailedEvent): void {
    ++this._count.errors;
    if (this.logLevel <= LogLevel.Error) {
      console.error(
        `failed to write file ${event.sourcePath} -> ${event.destinationPath}: ${event.error.message}`
      );
    }
  }
  onBluehawkErrors(event: BluehawkErrorsEvent): void {
    ++this._count.textFiles;
    this._count.errors += event.errors.length;
    if (this.logLevel <= LogLevel.Error) {
      console.error(
        `bluehawk errors on ${event.sourcePath}:\n${event.errors
          .map((error) => {
            return `(${error.component}) Line ${error.location.line}:${error.location.column} - ${error.message}`;
          })
          .join("\n")}`
      );
    }
  }

  printSummary(): void {
    const { binaryFiles, errors, textFiles, filesWritten } = this._count;
    console.log(`Processed ${binaryFiles + textFiles} files:
- ${binaryFiles} binary files
- ${textFiles} text files
- ${errors} errors
- ${filesWritten} files written`);
  }
}
