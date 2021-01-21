import { ICustomPattern, IToken } from "chevrotain";
import { strict as assert } from "assert";

// You can use custom payloads to store the full text and other information in
// the token. This allows a CST visitor to operate on the full document. See
// http://sap.github.io/chevrotain/docs/guide/custom_token_patterns.html#custom-payloads
export interface PayloadQuery {
  text: string;
  offset: number;
  tokens: IToken[];
  groups: {
    [groupName: string]: IToken[];
  };
  result: RegExpExecArray;
}

// Creates a CustomPattern with the given RegExp and getPayload callback
// function, which is called whenever the token is encountered by the lexer.
// It should return the payload for the token in the given circumstance.
export function makePayloadPattern<PayloadType>(
  pattern: RegExp,
  getPayload: (query: PayloadQuery) => PayloadType
): ICustomPattern {
  assert(
    pattern.sticky,
    "Custom pattern MUST be sticky (e.g. `y` in `/example/y`)"
  );
  return {
    exec: (
      text: string,
      offset: number,
      tokens: IToken[],
      groups: { [groupName: string]: IToken[] }
    ): RegExpExecArray | null => {
      // start the search at the offset
      pattern.lastIndex = offset;

      const result = pattern.exec(text);
      if (result) {
        // Store the payload options in the regex result as the payload.
        // Chevrotain will pick it up.
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        (result as any).payload = getPayload({
          text,
          offset,
          tokens,
          groups,
          result,
        });
      }
      return result;
    },
  };
}
