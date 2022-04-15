import {
  ActionReporter,
  BluehawkErrorsEvent,
  FileEvent,
  FileParsedEvent,
  FileWrittenEvent,
  IdsUnusedEvent,
  ParserNotFoundEvent,
  StateNotFoundEvent,
  StatesFoundEvent,
  WriteFailedEvent,
} from "./ActionReporter";
export class ConsoleActionReporter implements ActionReporter {
  onBinaryFile(event: FileEvent): void {
    console.log(`found binary file: ${event.sourcePath}`);
  }
  onFileParsed(event: FileParsedEvent): void {
    console.log(`parsed file: ${event.sourcePath}`);
  }
  onFileWritten(event: FileWrittenEvent): void {
    console.log(
      `wrote ${event.type} file based on ${event.sourcePath} -> ${event.destinationPath}`
    );
  }
  onStatesFound(event: StatesFoundEvent): void {
    console.log(`found states: ${event.statesFound.join(", ")}`);
  }
  onStateNotFound(event: StateNotFoundEvent): void {
    console.warn(`state not found: ${event.state}`);
  }
  onIdsUnused(event: IdsUnusedEvent): void {
    console.warn(`ids not used: ${event.ids.join(", ")}`);
  }
  onParserNotFound(event: ParserNotFoundEvent): void {
    console.warn(
      `parser not found for file ${event.sourcePath}: ${event.error.message}`
    );
  }
  onWriteFailed(event: WriteFailedEvent): void {
    console.error(
      `failed to write file ${event.sourcePath} -> ${event.destinationPath}: ${event.error.message}`
    );
  }
  onBluehawkErrors(event: BluehawkErrorsEvent): void {
    console.error(
      `bluehawk errors on ${event.sourcePath}:\n${event.errors
        .map((error) => {
          return `(${error.component}) Line ${error.location.line}:${error.location.column} - ${error.message}`;
        })
        .join("\n")}`
    );
  }
}
