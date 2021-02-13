import { ParseResult } from "../parser/ParseResult";
import { Document, CommandAttributes } from "../Document";
import { CommandNode } from "../parser/CommandNode";
import { AnyCommand } from "../commands/Command";

export type BluehawkFiles = { [pathName: string]: ParseResult };

export interface ProcessRequest {
  // Process the given Bluehawk result, optionally under an alternative id, and
  // emit the file.
  fork: (args: ForkArgs) => Promise<void>;

  // The overall result being processed by the processor
  parseResult: ParseResult;

  // The specific command to process
  command: CommandNode;
}

export type CommandProcessors = Record<string, AnyCommand>;

export type Listener = (result: ParseResult) => void | Promise<void>;

export class Processor {
  processors: CommandProcessors = {};
  listeners = new Set<Listener>();

  // Subscribe to processed file events
  subscribe(listener: Listener): void {
    this.listeners.add(listener);
  }

  // Publish a processed file
  publish(result: ParseResult): void {
    // Fire and forget, don't wait for listeners to complete before continuing
    // to process files.
    this.listeners.forEach(async (listener) => {
      try {
        await listener(result);
      } catch (error) {
        // Don't let listener exceptions disrupt the processor or other listeners.
        console.error(
          `When processing result '${result.source.path}', a listener failed with the following error: ${error}

This is probably not a bug in the Bluehawk library itself. Please check with the listener implementer.`
        );
      }
    });
  }

  // Processes the given Bluehawk result, optionally under an alternative id,
  // and emits the file.
  async fork({
    _processorState,
    parseResult,
    newPath,
    newModifier,
    newAttributes,
  }: ForkArgsWithState): Promise<void> {
    const { source } = parseResult;
    const modifier = Document.makeModifier(source.modifier, newModifier);
    const fileId = Document.makeId(newPath ?? source.path, modifier);
    if (_processorState.files[fileId] !== undefined) {
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
    _processorState.files[fileId] = newResult;
    const promises = this._process(
      _processorState,
      newResult.commandNodes,
      newResult
    );
    await Promise.all(promises);
    this.publish(newResult);
  }

  // Processes the given Bluehawk result. Resulting files are also emitted to
  // listeners, which can be added with subscribe().
  process = async (parseResult: ParseResult): Promise<BluehawkFiles> => {
    const _processorState = new ProcessorState();
    await this.fork({ parseResult, _processorState });
    return _processorState.files;
  };

  private _process = (
    _processorState: ProcessorState,
    commandSubset: CommandNode[],
    result: ParseResult
  ): Promise<void>[] => {
    return commandSubset.reduce((promises, command): Promise<void>[] => {
      const processor = this.processors[command.commandName];
      if (processor === undefined) {
        return promises;
      }
      // Commands are not necessarily async
      const maybePromise = processor.process({
        fork: (args: ForkArgs) => {
          return this.fork({
            ...args,
            _processorState,
          });
        },
        parseResult: result,
        command,
      });
      if (maybePromise instanceof Promise) {
        promises.push(maybePromise);
      }
      if (command.children !== undefined) {
        promises.push(
          ...this._process(_processorState, command.children, result)
        );
      }
      return promises;
    }, [] as Promise<void>[]);
  };

  registerCommand(name: string, command: AnyCommand): void {
    this.processors[name] = command;
  }
}

export interface ForkArgs {
  parseResult: ParseResult;
  newPath?: string;
  newModifier?: string;
  newAttributes?: CommandAttributes;
}

interface ForkArgsWithState extends ForkArgs {
  _processorState: ProcessorState;
}

class ProcessorState {
  files: BluehawkFiles = {};
}
