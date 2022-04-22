import { ActionReporter } from "./../actions/ActionReporter";
import { strict as assert } from "assert";
import { AnyTagNode, ParseResult } from "../parser";
import { Document, TagAttributes } from "../Document";
import { AnyTag, removeMetaRange } from "../tags";
import MagicString from "magic-string";

export type BluehawkFiles = { [pathName: string]: ProcessResult };

export interface ProcessOptions {
  waitForListeners: boolean;
  stripUnknownTags?: boolean;
}

export type ProcessResult = {
  parseResult: ParseResult;
  document: Document;
};

export interface ProcessRequest<TagNodeType = AnyTagNode> {
  /**
    The document to be edited by the processor.

    Tag processors may edit the document text directly using MagicString
    functionality. Avoid converting the text to a non-MagicString string, as the
    edit history must be retained for subsequent edits and listener processing
    to work as expected.

    Tag processors may safely modify the attributes of the document under
    their own tag name's key (e.g. a tag named "myTag" may freely
    edit `document.attributes["myTag"]`). Attributes are useful for passing
    meta information from the tag to an eventual listener.
   */
  document: Document;

  /**
    The specific tag to process.
   */
  tagNode: TagNodeType;

  /**
    The overall result's tag nodes being processed by the processor.
   */
  tagNodes: AnyTagNode[];

  /**
    Process the given Bluehawk result, optionally under an alternative id, and
    emit the file.
   */
  fork: (args: ForkArgs) => void;

  /**
    Call this to stop the processor from continuing into the tag node's
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
    The tag nodes in the parse result.
   */
  tagNodes: AnyTagNode[];

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
  newAttributes?: TagAttributes;
}

export type TagProcessors = Record<string, AnyTag>;

export type Listener = (result: ProcessResult) => void | Promise<void>;

export class Processor {
  readonly processors: TagProcessors = {};
  private _listeners = new Set<Listener>();
  private _publishPromises: Promise<void>[] = [];

  /**
    Adds a tag definition to the processor. This tag becomes available
    to use when processing tag nodes.
   */
  registerTag(tag: AnyTag, alternateName?: string): void {
    this.processors[alternateName ?? tag.name] = tag;
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
      parseResult.tagNodes,
      processOptions
    );
    const _processorState = new ProcessorState(parseResult, processOptions);
    await this._fork({
      tagNodes: parseResult.tagNodes,
      document: parseResult.source,
      _processorState,
    });
    await Promise.allSettled(_processorState.promises);
    return _processorState.files;
  };

  /**
    Call after all process calls have been made to wait for outstanding promises
    to resolve.

    Has no effect if `waitForListeners` was set to true.
   */
  waitForListeners = async (): Promise<void> => {
    await Promise.allSettled(this._publishPromises);
    this._publishPromises = [];
  };

  private _removeMetaRanges = (
    text: MagicString,
    tagNode: AnyTagNode | AnyTagNode[],
    options?: ProcessOptions
  ) => {
    if (Array.isArray(tagNode)) {
      tagNode.forEach((tagNode) =>
        this._removeMetaRanges(text, tagNode, options)
      );
      return;
    }
    if (
      !options?.stripUnknownTags &&
      this.processors[tagNode.tagName] === undefined
    ) {
      return;
    }
    removeMetaRange(text, tagNode);
    if (tagNode.children !== undefined) {
      this._removeMetaRanges(text, tagNode.children, options);
    }
  };

  // Process the given Bluehawk result, optionally under an alternative id, and
  // emit the file.
  private async _fork({
    _processorState,
    tagNodes,
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
    this._process(_processorState, tagNodes, newDocument, tagNodes);
    const publishPromise = this._publish(processResult);
    // Unless specifically asked to wait for listeners, we don't wait to
    // continue processing files.
    if (_processorState.waitForListeners) {
      await publishPromise;
    } else {
      this._publishPromises.push(publishPromise);
    }
  }

  // Actually execute the tag or tags within the result.
  private _process = (
    _processorState: ProcessorState,
    tagNode: AnyTagNode | AnyTagNode[],
    document: Document,
    allTagNodes: AnyTagNode[]
  ): void => {
    if (Array.isArray(tagNode)) {
      tagNode.forEach((tagNode) =>
        this._process(_processorState, tagNode, document, allTagNodes)
      );
      return;
    }
    const tag = this.processors[tagNode.tagName];
    if (tag === undefined) {
      return;
    }
    assert(
      (tagNode.type === "line" && tag.supportsLineMode) ||
        (tagNode.type === "block" && tag.supportsBlockMode),
      `${tagNode.tagName} found as a ${tagNode.type} tag, which is ` +
        `an unsupported mode for the corresponding tag processor. (This should ` +
        `have been reported as an error by the parser and the nodes should not have ` +
        `been sent to the processor.)`
    );

    let propagationStopped = false;
    tag.process({
      tagNode,
      tagNodes: allTagNodes,
      document,
      stopPropagation() {
        propagationStopped = true;
      },
      fork: (args: ForkArgs) => {
        // Tags cannot be async, so they can't await fork(). Store
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

    if (tagNode.children !== undefined && !propagationStopped) {
      this._process(_processorState, tagNode.children, document, allTagNodes);
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
