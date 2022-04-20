import { ParseResult } from "./../";
import { BluehawkError } from "./../BluehawkError";

/**
  Creates a type with a required ActionReporter field.
 */
export type WithActionReporter<T> = T & { reporter: ActionReporter };

/**
  Handles various events for user information.
 */
export interface ActionReporter {
  logLevel: LogLevel;
  get errorCount(): number;

  // Info
  onBinaryFile(event: BinaryFileEvent): void;
  onFileParsed(event: FileParsedEvent): void;
  onFileWritten(event: FileWrittenEvent): void;
  onStatesFound(event: StatesFoundEvent): void;

  // Warnings
  onStateNotFound(event: StateNotFoundEvent): void;
  onIdsUnused(event: IdsUnusedEvent): void;
  onParserNotFound(event: ParserNotFoundEvent): void;

  // Errors
  onFileError(event: FileErrorEvent): void;
  onWriteFailed(event: WriteFailedEvent): void;
  onBluehawkErrors(event: BluehawkErrorsEvent): void;

  /**
    Request the summary of all things reported so far.

    Users should call this after an action is complete.
   */
  summary(): void;
}

export enum LogLevel {
  Info = 0,
  Warning = 1,
  Error = 2,
}

export type FileEvent = {
  sourcePath: string;
};

export type BinaryFileEvent = FileEvent;

export type FileParsedEvent = FileEvent & {
  parseResult: ParseResult;
};

export type FileWrittenEvent = FileEvent & {
  destinationPath: string;
  type: "text" | "binary";
};

export type StatesFoundEvent = {
  action: string;
  paths: string[];
  statesFound: string[];
};

export type StateNotFoundEvent = {
  paths: string[];
  state: string;
};

export type IdsUnusedEvent = {
  paths: string[];
  ids: string[];
};

export type ParserNotFoundEvent = FileEvent & {
  error: Error;
};

export type FileErrorEvent = FileEvent & {
  error: Error;
};

export type WriteFailedEvent = FileWrittenEvent & {
  error: Error;
};

export type BluehawkErrorsEvent = FileEvent & {
  errors: BluehawkError[];
};
