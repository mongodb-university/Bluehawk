import { BluehawkResult, BluehawkSource } from "../bluehawk";
import { CommandNode } from "../parser/CommandNode";

export type BluehawkFiles = { [pathName: string]: BluehawkResult };

export interface ProcessRequest {
  // The processor that initiated this request
  processor: Processor;

  // The result being processed by the rootProcessor
  bluehawkResult: BluehawkResult;

  // The specific command to process
  command: CommandNode;
}

// The implementation that actually carries out the command.
export type CommandProcessor = (request: ProcessRequest) => void;

export class Processor {
  processors: Record<string, CommandProcessor> = {};

  // Processes the given bluehawk result under an alternative path.
  fork(
    newPath: string,
    bluehawkResult: BluehawkResult,
    attributes?: { [key: string]: string }
  ): void {
    if (this._outputFiles[newPath] !== undefined) {
      return;
    }
    const newResult = {
      ...bluehawkResult,
      source: new BluehawkSource({
        ...bluehawkResult.source,
        filePath: newPath,
        attributes,
      }),
    };
    this._outputFiles[newPath] = newResult;
    this._process(newResult.commands, newResult);
  }

  // Processes the given bluehawk result, returning a map of file paths to
  // processed bluehawk results.
  process = (result: BluehawkResult): BluehawkFiles => {
    // Clear the state (FIXME: state could be passed in the request)
    this._outputFiles = {};
    this.fork(result.source.filePath, result);
    return this._outputFiles;
  };

  private _process = (
    commandSubset: CommandNode[],
    result: BluehawkResult
  ): void => {
    commandSubset.forEach((command) => {
      const processor = this.processors[command.commandName];
      if (processor !== undefined) {
        processor({
          processor: this,
          bluehawkResult: result,
          command,
        });
      }
      if (command.children !== undefined) {
        this._process(command.children, result);
      }
    });
  };

  registerCommand(name: string, command: CommandProcessor): void {
    this.processors[name] = command;
  }

  private _outputFiles: BluehawkFiles = {};
}
