export interface LanguageSpecification {
  // The ID of the specified language.
  languageId: string;

  // The single line comment patterns.
  lineComments?: RegExp[];

  // The start and end patterns for block comments.
  blockComments?: [RegExp, RegExp][];

  // String literals as a pattern. This prevents accidentally catching other
  // tokens that actually appear within a string.
  stringLiterals?: {
    pattern: RegExp;
    // Set to true if the pattern can match across multiple lines.
    multiline: boolean;
  }[];

  // Patterns for pushing a different language parser onto the stack. For
  // example, a PHP environment typically starts off as an HTML parser and only
  // parses PHP within <?php and ?> tags.
  parserPushers?: {
    // The language ID of the parser to push.
    languageId: string;
    // The push and pop patterns
    patterns: [RegExp, RegExp];
    // If the pushed parser should receive the push and pop tokens themselves,
    // set these to true. Undefined is considered false.
    startNewParserOnPushToken?: boolean;
    endNewParserAfterPopToken?: boolean;
  }[];
}
