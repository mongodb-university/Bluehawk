import { AttributeListStart, Identifier, Newline, Space } from "./tokens";

// After a command start tag, there may be an attributes list or ID until the
// end of line.
export const CommandAttributesMode = [
  AttributeListStart,
  Identifier,
  Space,
  { ...Newline, POP_MODE: true },
];
