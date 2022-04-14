import { Document } from "./Document";

describe("Document", () => {
  it("maps original locations to new", async (done) => {
    const document = new Document({
      path: "",
      text: `line1
line2
line3
line4
`,
    });
    document.text.remove(14, 20); // line3
    expect(document.text.toString()).toBe(`line1
line2
line4
`);

    expect(
      await document.getNewLocationFor({
        column: 1,
        line: 1, // Not affected
      })
    ).toStrictEqual({
      column: 1,
      line: 1, // No change
    });

    expect(
      await document.getNewLocationFor({
        column: 3,
        line: 4, // Line above was removed...
      })
    ).toStrictEqual({
      column: 3,
      line: 3, // ...so line is 1 less
    });

    expect(
      await document.getNewLocationFor({
        column: 1,
        line: 6, // Outside of range
      })
    ).toBeUndefined();

    expect(
      await document.getNewLocationFor({
        column: 1,
        line: 3, // line was deleted
      })
    ).toStrictEqual({
      column: 1,
      line: 3, // :shrug:
    });

    done();
  });
});
