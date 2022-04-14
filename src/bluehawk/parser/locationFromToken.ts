import { strict as assert } from "assert";
import { IToken } from "chevrotain";
import { Location } from "../Location";

export function locationFromToken(token: IToken): Location {
  return {
    line: token.startLine ?? -1,
    column: token.startColumn ?? -1,
    offset: token.startOffset ?? -1,
  };
}

export function locationAfterToken(token: IToken, fullText: string): Location {
  const location: Location = {
    line: token.endLine ?? -1,
    column: token.endColumn ?? -1,
    offset: token.endOffset ?? -1,
  };
  // Ensure the line/column are correctly rolled over if the character is
  // actually a newline
  const index = location.offset;
  assert(index !== undefined);
  if (/\r|\n/.test(fullText[index])) {
    location.column = 1;
    location.line += 1;
  }
  return location;
}

export function nextLineAfterToken(token: IToken, fullText: string): Location {
  assert(token.endOffset !== undefined);
  assert(token.endLine !== undefined);
  const re = /.*(\r\n|\r|\n)/y;
  re.lastIndex = token.endOffset;
  const match = re.exec(fullText);
  if (!match) {
    // This is a weird case. Must be at EOF.
    return locationAfterToken(token, fullText);
  }
  return {
    column: 1,
    line: token.endLine + 1,
    offset: token.endOffset + match[0].length,
  };
}
