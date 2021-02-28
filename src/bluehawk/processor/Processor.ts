import { strict as assert } from "assert";
import { AnyCommandNode, ParseResult } from "../parser";
import { Document, CommandAttributes } from "../Document";
import { AnyCommand, removeMetaRange } from "../commands";
import MagicString from "magic-string";

export type BluehawkFiles = { [pathName: string]: ParseResult };

export interface ProcessOptions {
  waitForListeners?: boolean;
  stripUnknownCommands?: boolean;
}

export interface ProcessRequest<CommandNodeType = AnyCommandNode> {
  /**
    Process the given Bluehawk result, optionally under an alternative id, and
    emit the file.
   */
  fork: (args: ForkArgs) => void;

  /**
    The overall result being processed by the processor.
   */
  parseResult: ParseResult;

  /**
    The specific command to process.
   */
  commandNode: CommandNodeType;
}

export type CommandProcessors = Record<string, AnyCommand>;

export type Listener = (result: ParseResult) => void | Promise<void>;

export class Processor {
  readonly processors: CommandProcessors = {};
  private _listeners = new Set<Listener>();

  /**
    Adds a command definition to the processor. This command becomes available
    to use when processing command nodes.
   */
  registerCommand(command: AnyCommand, alternateName?: string): void {
    this.processors[alternateName ?? command.name] = command;
  }

  /**
    Subscribe to processed file events.
   */
  subscribe(listener: Listener): void {
    this._listeners.add(listener);
  }

  /**
    Processes the given [[Bluehawk.parse]] result. Resulting files are emitted
    to listeners, which can be added with [[Processor.subscribe]].
   */
  process = async (
    parseResult: ParseResult,
    processOptions?: ProcessOptions
  ): Promise<BluehawkFiles> => {
    this._removeMetaRanges(
      parseResult.source.text,
      parseResult.commandNodes,
      processOptions
    );
    const _processorState = new ProcessorState(processOptions);
    await this._fork({ parseResult, _processorState });
    await Promise.allSettled(_processorState.promises);
    return _processorState.files;
  };

  private _removeMetaRanges = (
    text: MagicString,
    commandNode: AnyCommandNode | AnyCommandNode[],
    options?: ProcessOptions
  ) => {
    if (Array.isArray(commandNode)) {
      commandNode.forEach((commandNode) =>
        this._removeMetaRanges(text, commandNode, options)
      );
      return;
    }
    if (
      !options?.stripUnknownCommands &&
      this.processors[commandNode.commandName] === undefined
    ) {
      return;
    }
    removeMetaRange(text, commandNode);
    if (commandNode.children !== undefined) {
      this._removeMetaRanges(text, commandNode.children, options);
    }
  };

  // Process the given Bluehawk result, optionally under an alternative id, and
  // emit the file.
  private async _fork({
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
    this._process(_processorState, newResult.commandNodes, newResult);
    const publishPromise = this._publish(newResult);
    // Unless specifically asked to wait for listeners, we don't wait to
    // continue processing files.
    if (_processorState.waitForListeners) {
      await publishPromise;
    }
  }

  // Actually execute the command or commands within the result.
  private _process = (
    _processorState: ProcessorState,
    commandNode: AnyCommandNode | AnyCommandNode[],
    result: ParseResult
  ): void => {
    if (Array.isArray(commandNode)) {
      commandNode.forEach((commandNode) =>
        this._process(_processorState, commandNode, result)
      );
      return;
    }
    const command = this.processors[commandNode.commandName];
    if (command === undefined) {
      return;
    }
    assert(
      (commandNode.type === "line" && command.supportsLineMode) ||
        (commandNode.type === "block" && command.supportsBlockMode),
      `${commandNode.commandName} found as a ${commandNode.type} command, which is ` +
        `an unsupported mode for the corresponding command processor. (This should ` +
        `have been reported as an error by the parser and the nodes should not have ` +
        `been sent to the processor.)`
    );

    command.process({
      fork: (args: ForkArgs) => {
        // Commands cannot be async, so they can't await fork(). Store
        // promises so that the main entrypoint can await them before
        // resolving.
        _processorState.promises.push(
          this._fork({
            ...args,
            _processorState,
          })
        );
      },
      parseResult: result,
      commandNode,
    });

    if (commandNode.children !== undefined) {
      this._process(_processorState, commandNode.children, result);
    }
  };

  // Publish a processed file
  private async _publish(result: ParseResult): Promise<void> {
    const promises = Array.from(this._listeners.values()).map(
      async (listener) => {
        try {
          await listener(result);
        } catch (error) {
          // Don't let listener exceptions disrupt the processor or other listeners.
          console.error(
            `When processing result '${result.source.path}', a listener failed with the following error: ${error}

This is probably not a bug in the Bluehawk library itself. Please check with the listener implementer.`
          );
        }
      }
    );
    await Promise.allSettled(promises);
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
  constructor(processOptions?: ProcessOptions) {
    if (processOptions === undefined) {
      return;
    }
    if (processOptions.waitForListeners !== undefined) {
      this.waitForListeners = processOptions.waitForListeners;
    }
  }

  files: BluehawkFiles = {};
  waitForListeners = false;
  promises: Promise<unknown>[] = [];
}
