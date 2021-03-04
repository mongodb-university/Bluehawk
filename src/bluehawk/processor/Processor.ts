import { strict as assert } from "assert";
import { AnyCommandNode, ParseResult } from "../parser";
import { Document, CommandAttributes } from "../Document";
import { AnyCommand, removeMetaRange } from "../commands";
import MagicString from "magic-string";

export type BluehawkFiles = { [pathName: string]: ProcessResult };

export interface ProcessOptions {
  waitForListeners: boolean;
  stripUnknownCommands?: boolean;
}

export type ProcessResult = {
  parseResult: ParseResult;
  document: Document;
};

export interface ProcessRequest<CommandNodeType = AnyCommandNode> {
  /**
    The document to be edited by the processor.

    Command processors may edit the document text directly using MagicString
    functionality. Avoid converting the text to a non-MagicString string, as the
    edit history must be retained for subsequent edits and listener processing
    to work as expected.

    Command processors may safely modify the attributes of the document under
    their own command name's key (e.g. a command named "myCommand" may freely
    edit `document.attributes["myCommand"]`). Attributes are useful for passing
    meta information from the command to an eventual listener.
   */
  document: Document;

  /**
    The specific command to process.
   */
  commandNode: CommandNodeType;

  /**
    The overall result's command nodes being processed by the processor.
   */
  commandNodes: AnyCommandNode[];

  /**
    Process the given Bluehawk result, optionally under an alternative id, and
    emit the file.
   */
  fork: (args: ForkArgs) => void;

  /**
    Call this to stop the processor from continuing into the command node's
    children.
   */
  stopPropagation: () => void;
}

/**
  The arguments to a fork request.
 */
export interface ForkArgs {
  /**
    The document to be forked.
   */
  document: Document;

  /**
    The command nodes in the parse result.
   */
  commandNodes: AnyCommandNode[];

  /**
    The new text (derived from the document.text) of the forked document. If
    undefined, the original document's text is used.
   */
  newText?: MagicString;

  /**
    The new path of the forked document. If undefined, the original document
    path is used.
   */
  newPath?: string;

  /**
    Any additional modifiers to add to the forked document in addition to any
    existing modifiers of the original document. If undefined, the original
    document's modifiers (if any) are used.
   */
  newModifiers?: { [key: string]: string };

  /**
    Any additional attributes to add to the forked document in addition to any
    existing attributes of the original document. If undefined, the original
    document's attributes (if any) are used.
   */
  newAttributes?: CommandAttributes;
}

export type CommandProcessors = Record<string, AnyCommand>;

export type Listener = (result: ProcessResult) => void | Promise<void>;

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
    const _processorState = new ProcessorState(parseResult, processOptions);
    await this._fork({
      commandNodes: parseResult.commandNodes,
      document: parseResult.source,
      _processorState,
    });
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
    commandNodes,
    document,
    newText,
    newPath,
    newModifiers,
    newAttributes,
  }: ForkArgsWithState): Promise<void> {
    const path = newPath ?? document.path;
    const modifiers = {
      ...document.modifiers,
      ...newModifiers,
    };
    const fileId = Document.makeId(path, modifiers);
    if (_processorState.files[fileId] !== undefined) {
      return;
    }
    const newDocument = new Document({
      path,
      text: newText ?? document.text,
      modifiers,
      attributes: {
        ...document.attributes,
        ...newAttributes,
      },
    });
    const processResult: ProcessResult = {
      parseResult: _processorState.parseResult,
      document: newDocument,
    };
    _processorState.files[fileId] = processResult;
    this._process(_processorState, commandNodes, newDocument, commandNodes);
    const publishPromise = this._publish(processResult);
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
    document: Document,
    allCommandNodes: AnyCommandNode[]
  ): void => {
    if (Array.isArray(commandNode)) {
      commandNode.forEach((commandNode) =>
        this._process(_processorState, commandNode, document, allCommandNodes)
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

    let propagationStopped = false;
    command.process({
      commandNode,
      commandNodes: allCommandNodes,
      document,
      stopPropagation() {
        propagationStopped = true;
      },
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
    });

    if (commandNode.children !== undefined && !propagationStopped) {
      this._process(
        _processorState,
        commandNode.children,
        document,
        allCommandNodes
      );
    }
  };

  // Publish a processed file
  private async _publish(result: ProcessResult): Promise<void> {
    const promises = Array.from(this._listeners.values()).map(
      async (listener) => {
        try {
          await listener(result);
        } catch (error) {
          // Don't let listener exceptions disrupt the processor or other listeners.
          console.error(
            `When processing result '${result.document.path}', a listener failed with the following error: ${error}

This is probably not a bug in the Bluehawk library itself. Please check with the listener implementer.`
          );
        }
      }
    );
    await Promise.allSettled(promises);
  }
}

interface ForkArgsWithState extends ForkArgs {
  _processorState: ProcessorState;
}

class ProcessorState {
  constructor(parseResult: ParseResult, processOptions?: ProcessOptions) {
    this.parseResult = parseResult;
    if (processOptions === undefined) {
      return;
    }
    if (processOptions.waitForListeners !== undefined) {
      this.waitForListeners = processOptions.waitForListeners;
    }
  }

  parseResult: ParseResult;
  files: BluehawkFiles = {};
  waitForListeners = false;
  promises: Promise<unknown>[] = [];
}
