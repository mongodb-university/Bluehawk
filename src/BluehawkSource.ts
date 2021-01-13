import MagicString from "magic-string";
import path from "path";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CommandAttributes = { [forCommandName: string]: any };

// Represents a file
export class BluehawkSource {
  constructor({
    text,
    language,
    path,
    attributes,
  }: {
    text: string | MagicString;
    language: string;
    path: string;
    attributes?: { [key: string]: string };
  }) {
    this.text =
      typeof text === "string" || text instanceof String
        ? new MagicString(text as string)
        : text.clone();

    this.path = path;
    this.attributes = attributes ?? {};
    this.language = language;
  }

  // Store the source text as a conveniently editable magic string.
  // See https://www.npmjs.com/package/magic-string for details.
  text: MagicString;
  path: string;
  language: string;
  attributes: CommandAttributes;

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
