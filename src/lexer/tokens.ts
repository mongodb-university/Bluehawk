import { createToken, Lexer } from "chevrotain";
import { PayloadQuery, makePayloadPattern } from "./makePayloadPattern";

const LineComment = createToken({
  name: "LineComment",
  pattern: Lexer.NA,
});

const BlockCommentStart = createToken({
  name: "BlockCommentStart",
  pattern: Lexer.NA,
});

const BlockCommentEnd = createToken({
  name: "BlockCommentEnd",
  pattern: Lexer.NA,
});

const PushParser = createToken({
  name: "PushParser",
  pattern: Lexer.NA,
});

const PopParser = createToken({
  name: "PopParser",
  pattern: Lexer.NA,
});

const AttributeListEnd = createToken({
  name: "AttributeListEnd",
  pattern: /}/,
  pop_mode: true,
  categories: [PopParser],
});

const AttributeListStart = createToken({
  name: "AttributeListStart",
  pattern: makePayloadPattern(/{/y, ({ text }: PayloadQuery) => ({
    fullText: text,
  })),
  push_mode: "AttributeListMode",
  line_breaks: false,
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
  PopParser,
  PushParser,
  BlockCommentEnd,
  BlockCommentStart,
  COMMAND_END_PATTERN,
  COMMAND_PATTERN,
  COMMAND_START_PATTERN,
  Command,
  CommandEnd,
  CommandStart,
  Identifier,
  JsonStringLiteral,
  LineComment,
  Newline,
  Space,
  Text,
};
