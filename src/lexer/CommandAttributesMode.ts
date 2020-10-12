import { createToken } from "chevrotain";
import { Newline, Space } from "../tokens";

// After a command start tag, there may be an attributes list or ID until the
// end of line.
export const CommandAttributesMode = [
  createToken({
    name: "AttributeListStart",
    pattern: /{/,
    push_mode: "AttributeListMode",
  }),
  createToken({
    name: "Identifier",
    pattern: /[_A-z][A-z0-9-_]*/,
  }),
  Space,
  { ...Newline, POP_MODE: true },
];
