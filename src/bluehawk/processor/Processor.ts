import { strict as assert } from "assert";
import { AnyCommandNode, ParseResult } from "../parser";
import { Document, CommandAttributes } from "../Document";
import { AnyCommand } from "../commands";

export type BluehawkFiles = { [pathName: string]: ParseResult };

export interface ProcessRequest<CommandNodeType = AnyCommandNode> {
  // Process the given Bluehawk result, optionally under an alternative id, and
  // emit the file.
  fork: (args: ForkArgs) => Promise<void>;

  // The overall result being processed by the processor
  parseResult: ParseResult;

  // The specific command to process
  commandNode: CommandNodeType;
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
    commandSubset: AnyCommandNode[],
    result: ParseResult
  ): Promise<void>[] => {
    return commandSubset.reduce((promises, commandNode): Promise<void>[] => {
      const command = this.processors[commandNode.commandName];
      if (command === undefined) {
        return promises;
      }
      // Commands are not necessarily async
      const maybePromise = (() => {
        assert(
          (commandNode.type === "line" && command.supportsLineMode) ||
            (commandNode.type === "block" && command.supportsBlockMode),
          `${commandNode.commandName} found as a ${commandNode.type} command, which is an unsupported mode for the corresponding command processor. (This should have been reported as an error by the parser and the nodes should not have been sent to the processor.)`
        );
        return command.process({
          fork: (args: ForkArgs) => {
            return this.fork({
              ...args,
              _processorState,
            });
          },
          parseResult: result,
          commandNode,
        });
      })();
      if (maybePromise instanceof Promise) {
        promises.push(maybePromise);
      }
      if (commandNode.children !== undefined) {
        promises.push(
          ...this._process(_processorState, commandNode.children, result)
        );
      }
      return promises;
    }, [] as Promise<void>[]);
  };

  registerCommand<Command extends AnyCommand>(
    name: string,
    command: Command
  ): void {
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
