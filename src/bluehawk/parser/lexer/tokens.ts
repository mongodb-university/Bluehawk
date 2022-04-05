import { createToken, Lexer } from "chevrotain";
import { PayloadQuery, makePayloadPattern } from "./makePayloadPattern";

export const JSON_STRING_LITERAL_PATTERN =
  /"(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/;

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

const StringLiteral = createToken({
  name: "StringLiteral",
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
  pattern: /[^\S\r\n]/,
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
// aligned (both in the editor for at-a-glance error checking and as regexes).
// TODO: Allow any amount of non-newline white space (/[^\S\r\n]*/) to be
// included before or after the actual tag name to make stripping it out
// much easier.
const TAG_START_PATTERN /**/ = /:([A-z0-9-]+)-start:/;
const TAG_END_PATTERN /*  */ = /:([A-z0-9-]+)-end:/;
const TAG_PATTERN /*      */ = /:([A-z0-9-]+):[^\S\r\n]*/;

const TagStart = createToken({
  name: "TagStart",
  pattern: TAG_START_PATTERN,
  push_mode: "TagAttributesMode",
});

const TagEnd = createToken({
  name: "TagEnd",
  pattern: TAG_END_PATTERN,
});

const Tag = createToken({
  name: "Tag",
  pattern: TAG_PATTERN,
});

const Identifier = createToken({
  name: "Identifier",
  pattern: /[_A-z][A-z0-9-_]*/,
});

const JsonStringLiteral = createToken({
  name: "JsonStringLiteral",
  pattern: JSON_STRING_LITERAL_PATTERN,
  categories: [StringLiteral],
});

export {
  AttributeListEnd,
  AttributeListStart,
  PopParser,
  PushParser,
  BlockCommentEnd,
  BlockCommentStart,
  TAG_END_PATTERN,
  TAG_PATTERN,
  TAG_START_PATTERN,
  Tag,
  TagEnd,
  TagStart,
  Identifier,
  JsonStringLiteral,
  LineComment,
  Newline,
  Space,
  StringLiteral,
  Text,
};
