import MagicString from "magic-string";
import { Range } from "../bluehawk";
import { removeMetaRange } from "./removeMetaRange";

describe("removeMetaRange", () => {
  it("strips everything when no content range is provided", () => {
    const s = new MagicString(`a
b
c`);
    const lineRange: Range = {
      start: {
        line: 1,
        column: 1,
        offset: 0,
      },
      end: {
        line: 3,
        column: 2,
        offset: s.length(),
      },
    };
    expect(s.toString()).toBe(`a
b
c`);
    removeMetaRange(s, { lineRange });
    expect(s.toString()).toBe("");
  });

  it("strips everything but the content range", () => {
    const s = new MagicString(`a
b
c`);
    const contentRange: Range = {
      start: {
        line: 2,
        column: 1,
        offset: 2,
      },
      end: {
        line: 2,
        column: 2,
        offset: 3,
      },
    };
    const lineRange: Range = {
      start: {
        line: 1,
        column: 1,
        offset: 0,
      },
      end: {
        line: 3,
        column: 2,
        offset: s.length(),
      },
    };
    expect(s.toString()).toBe(`a
b
c`);
    removeMetaRange(s, { lineRange, contentRange });
    expect(s.toString()).toBe(`b`);
  });
});
