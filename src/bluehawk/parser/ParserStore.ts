import { LanguageSpecification, IParser, makeParser } from "./";

// Maintains a map of file extensions corresponding to language specifications
// that the store can use to provide language-specific parsers.
export class ParserStore {
  // Specify the special patterns for a given language.
  addLanguage = (
    forFileExtension: string | string[],
    languageSpecification: LanguageSpecification
  ): void => {
    const extensions = !Array.isArray(forFileExtension)
      ? [forFileExtension]
      : forFileExtension;
    extensions
      // Accept extensions with our without leading '.' but cut off the '.'
      .map(normalize)
      .forEach((extension) => {
        if (this._languageSpecs.has(extension)) {
          console.warn(
            `overriding language specification for extension '${extension}'`
          );
        }
        this._languageSpecs.set(extension, languageSpecification);
      });
  };

  // Returns the parser for the given language specification or the language
  // specification corresponding to the given extension that was added with
  // addLanguage(). Throws if no language specification can be found. Creates a
  // parser if needed.
  getParser = (
    documentOrLanguageSpecification:
      | { extension: string }
      | LanguageSpecification
  ): IParser => {
    const { extension } = documentOrLanguageSpecification as {
      extension?: string;
    };
    const normalizedExtension = extension && normalize(extension);
    const spec =
      normalizedExtension === undefined
        ? (documentOrLanguageSpecification as LanguageSpecification)
        : this._languageSpecs.get(normalizedExtension);

    if (spec === undefined) {
      throw new Error(
        `no parser available for extension '${normalizedExtension}'. Did you add it with addLanguage()?`
      );
    }

    const { languageId } = spec;

    if (!this._parsers.has(languageId)) {
      // Lazy-load the parser
      const parser = makeParser(spec);
      this._parsers.set(languageId, parser);
    }

    const parser = this._parsers.get(languageId);
    if (parser === undefined) {
      throw new Error(`could not load parser for language ID '${languageId}'`);
    }
    return parser;
  };

  getDefaultParser = (): IParser => {
    return this.getParser({
      languageId: "__default__",
    });
  };

  private _languageSpecs = new Map<
    string /* file extension */,
    LanguageSpecification
  >();
  private _parsers = new Map<string /* language ID */, IParser>();
}

// Remove a leading dot from the extension and make it lowercase for case
// insensitivity
function normalize(extension: string): string {
  return (/^\./.test(extension)
    ? extension.substring(1)
    : extension
  ).toLowerCase();
}
