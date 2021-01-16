import { ParseResult } from "../parser/ParseResult";
import { Document, CommandAttributes } from "../Document";
import { CommandNode } from "../parser/CommandNode";
import { Command } from "../commands/Command";

export type BluehawkFiles = { [pathName: string]: ParseResult };

export interface ProcessRequest {
  // The processor that initiated this request
  processor: Processor;

  // The overall result being processed by the processor
  parseResult: ParseResult;

  // The specific command to process
  command: CommandNode;
}

export type CommandProcessors = Record<string, Command>;

export type Listener = (result: ParseResult) => void;

export class Processor {
  processors: CommandProcessors = {};
  listeners = new Set<Listener>();

  // Subscribe to processed file events
  subscribe(listener: Listener): void {
    this.listeners.add(listener);
  }

  // Publish a processed file
  publish(result: ParseResult): void {
    this.listeners.forEach((listener) => listener(result));
  }

  // Processes the given Bluehawk result, optionally under an alternative id,
  // and emits the file.
  fork({
    parseResult,
    newPath,
    newModifier,
    newAttributes,
  }: {
    parseResult: ParseResult;
    newPath?: string;
    newModifier?: string;
    newAttributes?: CommandAttributes;
  }): void {
    const { source } = parseResult;
    const modifier = Document.makeModifier(source.modifier, newModifier);
    const fileId = Document.makeId(newPath ?? source.path, modifier);
    if (this._outputFiles[fileId] !== undefined) {
      return;
    }
    const newResult = {
      ...parseResult,
      source: new Document({
        ...source,
        modifier,
        attributes: {
          ...source.attributes,
          ...(newAttributes ?? {}),
        },
      }),
    };
    this._outputFiles[fileId] = newResult;
    const result = this._process(newResult.commandNodes, newResult);
    this.publish(result);
  }

  // Processes the given Bluehawk result. Resulting files are emitted to
  // listeners, which can be added with subscribe().
  process = (parseResult: ParseResult): BluehawkFiles => {
    // Clear the state (FIXME: state could be passed in the request)
    this._outputFiles = {};
    this.fork({ parseResult });
    const outputFiles = this._outputFiles;
    this._outputFiles = {};
    return outputFiles;
  };

  private _process = (
    commandSubset: CommandNode[],
    result: ParseResult
  ): ParseResult => {
    commandSubset.forEach((command) => {
      const processor = this.processors[command.commandName];
      if (processor === undefined) {
        return;
      }
      processor.process({
        processor: this,
        parseResult: result,
        command,
      });
      if (command.children !== undefined) {
        this._process(command.children, result);
      }
    });
    return result;
  };

  registerCommand(name: string, command: Command): void {
    this.processors[name] = command;
  }

  private _outputFiles: BluehawkFiles = {};
}
