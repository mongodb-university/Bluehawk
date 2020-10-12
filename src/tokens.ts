import { createToken, Lexer } from "chevrotain";

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

const CommandStart = createToken({
  name: "CommandStart",
  pattern: /:[a-z-]+-start:/,
  push_mode: "CommandAttributesMode",
});

const CommandEnd = createToken({
  name: "CommandEnd",
  pattern: /:[a-z-]+-end:/,
});

const Command = createToken({
  name: "Command",
  pattern: /:[a-z-]+:/,
});

const Identifier = createToken({
  name: "Identifier",
  pattern: /[_A-z][A-z0-9-_]*/,
});

export { Space, Newline, Text, CommandStart, CommandEnd, Command, Identifier };
