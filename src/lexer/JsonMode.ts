import { createToken, Lexer } from "chevrotain";

// Adapted from chevtrotain examples: https://github.com/SAP/chevrotain/blob/master/examples/grammars/json/json.js
export const JsonMode = [
  createToken({ name: "True", pattern: /true/ }),
  createToken({ name: "False", pattern: /false/ }),
  createToken({ name: "Null", pattern: /null/ }),
  createToken({ name: "LCurly", pattern: /{/, push_mode: "JsonMode" }),
  createToken({ name: "RCurly", pattern: /}/, pop_mode: true }),
  createToken({ name: "LSquare", pattern: /\[/ }),
  createToken({ name: "RSquare", pattern: /]/ }),
  createToken({ name: "Comma", pattern: /,/ }),
  createToken({ name: "Colon", pattern: /:/ }),
  createToken({
    name: "StringLiteral",
    pattern: /"(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/,
  }),
  createToken({
    name: "NumberLiteral",
    pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/,
  }),
  createToken({
    name: "WhiteSpace",
    pattern: /[ \t\n\r]+/,
    group: Lexer.SKIPPED,
  }),
];
