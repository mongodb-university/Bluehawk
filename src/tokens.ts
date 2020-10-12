import { createToken, Lexer } from "chevrotain";

const Space = createToken({
  name: "Spaces",
  pattern: /[\t ]+/,
  group: Lexer.SKIPPED,
});

const Newline = createToken({
  name: "Newline",
  pattern: /(\r\n|\r|\n)/,
  group: Lexer.SKIPPED,
  line_breaks: true,
});

const Text = createToken({
  name: "Text",
  pattern: /\S+/,
  group: Lexer.SKIPPED,
});

export { Space, Newline, Text };
