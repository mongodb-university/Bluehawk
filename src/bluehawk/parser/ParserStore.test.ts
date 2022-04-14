import { LanguageSpecification } from ".";
import { ParserStore } from "./ParserStore";

describe("ParserStore", () => {
  it("throws on unknown extension", () => {
    const parserStore = new ParserStore();
    expect(() => {
      parserStore.getParser({ extension: "unknown" });
    }).toThrowError(
      "no parser available for extension 'unknown'. Did you add it with addLanguage()?"
    );
  });

  it("reuses parsers", () => {
    const languageSpec1: LanguageSpecification = {
      languageId: "test",
    };
    const languageSpec2: LanguageSpecification = {
      languageId: "test2",
    };
    const parserStore = new ParserStore();
    const parser1a = parserStore.getParser(languageSpec1);
    expect(parser1a).toBeDefined();
    const parser2 = parserStore.getParser(languageSpec2);
    expect(parser2).toBeDefined();
    expect(parser1a).not.toStrictEqual(parser2);
    const parser1b = parserStore.getParser(languageSpec1);
    expect(parser1a).toStrictEqual(parser1b);
  });

  it("allows adding single extensions", () => {
    const parserStore = new ParserStore();
    parserStore.addLanguage("a", {
      languageId: "test",
    });
    expect(() => {
      // Still throw despite one added
      parserStore.getParser({ extension: "unknown" });
    }).toThrow();
    const p = parserStore.getParser({ extension: "a" });
    expect(p).toBeDefined();
  });

  it("allows adding extensions", () => {
    const parserStore = new ParserStore();
    parserStore.addLanguage(["a", ".b", ""], {
      languageId: "test",
    });
    expect(() => {
      // Still throw despite some added
      parserStore.getParser({ extension: "unknown" });
    }).toThrow();

    // Ignores first dots in extensions
    const pa = parserStore.getParser({ extension: "a" });
    expect(pa).toBeDefined();
    const pdota = parserStore.getParser({ extension: ".a" });
    expect(pdota).toBeDefined();
    const p = parserStore.getParser({ extension: "" });
    expect(p).toBeDefined();
    const pdot = parserStore.getParser({ extension: "." });
    expect(pdot).toBeDefined();
    const pb = parserStore.getParser({ extension: "b" });
    expect(pb).toBeDefined();
    const pdotb = parserStore.getParser({ extension: ".b" });
    expect(pdotb).toBeDefined();
    expect(pb).toStrictEqual(pa);
  });
});
