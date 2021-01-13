import { BluehawkResult } from "../bluehawk";
import { BluehawkSource, CommandAttributes } from "../BluehawkSource";
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
    additionalAttributes?: CommandAttributes
  ): BluehawkResult {
    if (this._outputFiles[newPath] !== undefined) {
      return;
    }
    const { source } = bluehawkResult;
    const newResult = {
      ...bluehawkResult,
      source: new BluehawkSource({
        ...bluehawkResult.source,
        path: newPath,
        attributes: {
          ...source.attributes,
          ...(additionalAttributes ?? {}),
        },
      }),
    };
    this._outputFiles[newPath] = newResult;
    return this._process(newResult.commands, newResult);
  }

  // Processes the given bluehawk result, returning a map of file paths to
  // processed bluehawk results.
  process = (result: BluehawkResult): BluehawkFiles => {
    // Clear the state (FIXME: state could be passed in the request)
    this._outputFiles = {};
    this.fork(result.source.path, result);
    return this._outputFiles;
  };

  private _process = (
    commandSubset: CommandNode[],
    result: BluehawkResult
  ): BluehawkResult => {
    commandSubset.forEach((command) => {
      const processor = this.processors[command.commandName];
      if (processor === undefined) {
        return;
      }
      processor({
        processor: this,
        bluehawkResult: result,
        command,
      });
      if (command.children !== undefined) {
        this._process(command.children, result);
      }
    });
    return result;
  };

  registerCommand(name: string, command: CommandProcessor): void {
    this.processors[name] = command;
  }

  private _outputFiles: BluehawkFiles = {};
}
