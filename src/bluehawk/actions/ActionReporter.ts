import { ParseResult } from "./../";
import { BluehawkError } from "./../BluehawkError";

/**
  Handles various events for user information.
 */
export interface ActionReporter {
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
  onWriteFailed(event: WriteFailedEvent): void;
  onBluehawkErrors(event: BluehawkErrorsEvent): void;

  /**
    Request the summary of all things reported so far.

    Users should call this after an action is complete.
   */
  summary(): void;
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

export type WriteFailedEvent = FileWrittenEvent & {
  error: Error;
};

export type BluehawkErrorsEvent = FileEvent & {
  errors: BluehawkError[];
};
