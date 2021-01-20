import MagicString from "magic-string";
import path, { join } from "path";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CommandAttributes = { [forCommandName: string]: any };

// Represents a file either before or after processing
export class Document {
  constructor({
    text,
    language,
    path,
    attributes,
    modifier,
  }: {
    text: string | MagicString;
    language: string;
    path: string;
    attributes?: { [key: string]: string };
    modifier?: string;
  }) {
    this.text =
      typeof text === "string" || text instanceof String
        ? new MagicString(text as string)
        : text.clone();

    this.path = join(path);
    this.attributes = attributes ?? {};
    this.language = language;
    this.modifier = modifier;
  }

  // Store the source text as a conveniently editable magic string.
  // See https://www.npmjs.com/package/magic-string for details.
  text: MagicString;
  path: string;
  // A file at one path may result in multiple output files after processing
  // (e.g. states). Different instances of the same file can be distinguished
  // with a modifier.
  modifier?: string;
  language: string;
  attributes: CommandAttributes;

  // Returns a modifier combined with a hypothetical new modifier. This allows
  // you to uniformly create modifiers, even from files with existing modifiers.
  static makeModifier = (
    originalModifier?: string,
    newModifier?: string
  ): string | undefined => {
    const elements: string[] = [];
    if (originalModifier !== undefined) {
      elements.push(originalModifier);
    }
    if (newModifier !== undefined) {
      elements.push(newModifier);
    }
    return elements.length > 0 ? elements.join("#") : undefined;
  };

  // Returns a uniform path + modifier combination to uniquely identify a file
  // instance.
  static makeId = (newPath: string, modifier?: string): string => {
    const elements = [newPath];
    if (modifier !== undefined) {
      elements.push(modifier);
    }
    return elements.join("#");
  };

  // Returns the name of the file minus the file extension
  get name(): string {
    return path.basename(this.path, this.extension);
  }

  get basename(): string {
    return path.basename(this.path);
  }

  get extension(): string {
    return path.extname(this.path);
  }

  get dirname(): string {
    return path.dirname(this.path);
  }

  // Returns the path with the given infix inserted between the file name and
  // the file extension, e.g. some.infix + example.js -> example.some.infix.js
  pathWithInfix = (infix: string): string => {
    return `${this.dirname}/${this.name}.${infix}${this.extension}`;
  };
}
