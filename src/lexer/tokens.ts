import { createToken, ICustomPattern, Lexer } from "chevrotain";
import { strict as assert } from "assert";

// Using custom payloads to store the full text in the token. This allows a CST
// visitor to operate on the full document. See
// http://sap.github.io/chevrotain/docs/guide/custom_token_patterns.html#custom-payloads
function makeStoreTextInPayloadPattern(pattern: RegExp): ICustomPattern {
  assert(
    pattern.sticky,
    "StoreTextInPayload pattern MUST be sticky (e.g. `y` in `/example/y`)"
  );
  return {
    exec: (text: string, offset: number): RegExpExecArray => {
      // start the search at the offset
      pattern.lastIndex = offset;

      const result = pattern.exec(text);
      if (result) {
        // Store the full text in the regex result as the payload. Chevrotain will
        // pick it up.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (result as any).payload = text;
      }
      return result;
    },
  };
}

const AttributeListStart = createToken({
  name: "AttributeListStart",
  pattern: makeStoreTextInPayloadPattern(/{/y),
  push_mode: "AttributeListMode",
  line_breaks: false,
});

const AttributeListEnd = createToken({
  name: "AttributeListEnd",
  pattern: /}/,
  pop_mode: true,
});

const Space = createToken({
  name: "Spaces",
  pattern: /[\t ]+/,
  group: Lexer.SKIPPED,
});

const Newline = createToken({
  name: "Newline",
  pattern: /(\r\n|\r|\n)/,
  line_breaks: true,
});

const Text = createToken({
  name: "Text",
  pattern: /\S/,
  group: Lexer.SKIPPED,
});

// Shared patterns with captures for use in CstVisitor. Please ensure they stay
// aligned (both in the editor for at-a-glance error checking and as regexes)
const COMMAND_START_PATTERN /**/ = /:([A-z0-9-]+)-start:/;
const COMMAND_END_PATTERN /*  */ = /:([A-z0-9-]+)-end:/;
const COMMAND_PATTERN /*      */ = /:([A-z0-9-]+):/;

const CommandStart = createToken({
  name: "CommandStart",
  pattern: COMMAND_START_PATTERN,
  push_mode: "CommandAttributesMode",
});

const CommandEnd = createToken({
  name: "CommandEnd",
  pattern: COMMAND_END_PATTERN,
});

const Command = createToken({
  name: "Command",
  pattern: COMMAND_PATTERN,
});

const Identifier = createToken({
  name: "Identifier",
  pattern: /[_A-z][A-z0-9-_]*/,
});

const JsonStringLiteral = createToken({
  name: "JsonStringLiteral",
  pattern: /"(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/,
});

export {
  AttributeListEnd,
  AttributeListStart,
  COMMAND_END_PATTERN,
  COMMAND_PATTERN,
  COMMAND_START_PATTERN,
  Command,
  CommandEnd,
  CommandStart,
  Identifier,
  JsonStringLiteral,
  Newline,
  Space,
  Text,
  makeStoreTextInPayloadPattern,
};
