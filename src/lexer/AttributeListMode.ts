import { createToken } from "chevrotain";
import { JsonMode } from "./JsonMode";

/*
Bluehawk uses AttributeListMode to parse the attribute list of a command:

    :code-block-start: {
      "id": "some-id",
      "attribute1": 1
    }

*/
// AttributeListMode is JsonMode with the "RCurly" JSON token replaced by
// the AttributeListEnd exit token (also '}', corresponding to the opening
// '{'). This is not strictly necessary but keeps the tokenization cleaner
// (outer '{...}' matches AttributeListStart/AttributeListEnd while inner
// objects '{...}' match LCurly/RCurly. This is all assuming any command
// ever supports inner objects in their attributes list.
export const AttributeListMode = [
  ...JsonMode.filter((token) => token.name !== "RCurly"),
  createToken({ name: "AttributeListEnd", pattern: /}/, pop_mode: true }),
];
