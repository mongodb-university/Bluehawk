import { createToken, Lexer } from "chevrotain";

const AttributeListStart = createToken({
  name: "AttributeListStart",
  pattern: /{/,
  push_mode: "AttributeListMode",
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
  pattern: /\S+/,
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
  Newline,
  Space,
  Text,
};
