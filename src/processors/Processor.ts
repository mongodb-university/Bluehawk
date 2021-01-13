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

export type Listener = (result: BluehawkResult) => void;

export class Processor {
  processors: Record<string, CommandProcessor> = {};
  listeners = new Set<Listener>();

  // Subscribe to processed file events
  subscribe(listener: Listener): void {
    this.listeners.add(listener);
  }

  // Publish a processed file
  publish(result: BluehawkResult): void {
    this.listeners.forEach((listener) => listener(result));
  }

  // Processes the given Bluehawk result, optionally under an alternative id,
  // and emits the file.
  fork({
    bluehawkResult,
    newPath,
    newModifier,
    newAttributes,
  }: {
    bluehawkResult: BluehawkResult;
    newPath?: string;
    newModifier?: string;
    newAttributes?: CommandAttributes;
  }): void {
    const { source } = bluehawkResult;
    const modifier = BluehawkSource.makeModifier(source.modifier, newModifier);
    const fileId = BluehawkSource.makeId(newPath ?? source.path, modifier);
    if (this._outputFiles[fileId] !== undefined) {
      return;
    }
    const newResult = {
      ...bluehawkResult,
      source: new BluehawkSource({
        ...source,
        modifier,
        attributes: {
          ...source.attributes,
          ...(newAttributes ?? {}),
        },
      }),
    };
    this._outputFiles[fileId] = newResult;
    const result = this._process(newResult.commands, newResult);
    this.publish(result);
  }

  // Processes the given Bluehawk result. Resulting files are emitted to
  // listeners, which can be added with subscribe().
  process = (bluehawkResult: BluehawkResult): BluehawkFiles => {
    // Clear the state (FIXME: state could be passed in the request)
    this._outputFiles = {};
    this.fork({ bluehawkResult });
    const outputFiles = this._outputFiles;
    this._outputFiles = {};
    return outputFiles;
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
