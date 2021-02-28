import MagicString from "magic-string";
import * as Path from "path";
import { SourceMapConsumer } from "source-map";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CommandAttributes = { [forCommandName: string]: any };

/**
  Represents a file either before or after processing.
 */
export class Document {
  /**
    Returns a uniform path + modifier combination to uniquely identify a file
    instance.
   */
  static makeId = (
    newPath: string,
    modifiers?: { [key: string]: string }
  ): string => {
    if (modifiers === undefined || Object.keys(modifiers).length === 0) {
      return newPath;
    }
    // Make a URL-like query string of the modifiers. No URL encoding is
    // performed, so this can't reliably be reversed. Use this only to identify
    // the file.
    return [
      newPath,
      Object.entries(modifiers ?? {})
        .map((entry) => entry.join("="))
        .join("&"),
    ].join("?");
  };

  /**
    The path and modifiers of the file form a way to identify this specific
    instance of a file.

    A file at one path may result in multiple output files after processing
    (e.g. states).
   */
  readonly id: string;

  /**
    The source text as a conveniently editable magic string. See
    https://www.npmjs.com/package/magic-string for details.
   */
  text: MagicString;

  /**
    The original path of the document.
   */
  path: string;

  /**
    Read-only attributes that contribute to the document's identity. Do not
    modify after the document's creation.

    A file at one path may result in multiple output files after processing
    (e.g. states). Different instances of the same file can be distinguished
    with modifiers.
   */
  readonly modifiers: { [key: string]: string };

  /**
    Attributes that a command can store information in for later processing by
    listeners.

    These do not affect the identity of the document.
   */
  attributes: CommandAttributes;

  /**
    Returns the name of the file minus the file extension.
   */
  get name(): string {
    return Path.basename(this.path, this.extension);
  }

  /**
    Returns the name of the file with the file extension, if any.
   */
  get basename(): string {
    return Path.basename(this.path);
  }

  /**
    Returns the file extension, if any, including the dot.
   */
  get extension(): string {
    return Path.extname(this.path);
  }

  /**
    Returns the path of the directory containing this file based on the path.
   */
  get dirname(): string {
    return Path.dirname(this.path);
  }

  constructor({
    text,
    path,
    attributes,
    modifiers,
  }: {
    text: string | MagicString;
    path: string;
    modifiers?: { [key: string]: string };
    attributes?: CommandAttributes;
  }) {
    this.text =
      typeof text === "string" || text instanceof String
        ? new MagicString(text as string)
        : text.clone();

    this.path = Path.join(path);
    this.attributes = attributes ?? {};
    this.modifiers = modifiers ?? {};
    this.id = Document.makeId(this.path, this.modifiers);
  }

  /*
    Returns the path with the given infix inserted between the file name and the
    file extension, e.g. some.infix + example.js -> example.some.infix.js
   */
  pathWithInfix = (infix: string): string => {
    return Path.join(this.dirname, `${this.name}.${infix}${this.extension}`);
  };

  /**
    Calculates the new position of the original line and column numbers.

    Offset is ignored. This should only be done after all text transformations
    are finalized.
   */
  async getNewLocationFor(oldLocation: {
    line: number;
    column: number;
  }): Promise<{ line: number; column: number } | undefined> {
    if (oldLocation.column < 1) {
      throw new Error("columns must be >= 1");
    }
    if (oldLocation.line < 1) {
      throw new Error("line must be >= 1");
    }
    const source = this.path; // required by SourceMapConsumer
    if (this._sourceMapConsumer === undefined) {
      this._sourceMapConsumer = await new SourceMapConsumer(
        this.text.generateMap({ source, hires: true })
      );
    }
    const newLocation = this._sourceMapConsumer.generatedPositionFor({
      source,
      column: oldLocation.column - 1, // source-map columns start at 0
      line: oldLocation.line,
      bias: SourceMapConsumer.LEAST_UPPER_BOUND,
    });
    if (newLocation.line === null || newLocation.line === null) {
      return undefined;
    }
    return {
      column: (newLocation.column ?? -2) + 1, // Bluehawk columns start at 1
      line: newLocation.line ?? -1,
    };
  }

  private _sourceMapConsumer?: SourceMapConsumer;
}
