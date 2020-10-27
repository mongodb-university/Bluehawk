import { createToken } from "chevrotain";
import { Identifier, Newline, Space } from "./tokens";

// After a command start tag, there may be an attributes list or ID until the
// end of line.
export const CommandAttributesMode = [
  createToken({
    name: "AttributeListStart",
    pattern: /{/,
    push_mode: "AttributeListMode",
  }),
  Identifier,
  Space,
  { ...Newline, POP_MODE: true },
];
