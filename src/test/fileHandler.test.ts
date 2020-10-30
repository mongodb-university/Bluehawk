import { createFileInfoArray } from "../fileHandler";
import { join, dirname } from "path";

describe("fileHandler createFileInfo", () => {
  const stages = ["start", "final"];
  let source: string;
  let destination: string;
  let stepOutputPath: string;
  let codeOutputPath: string;

  it("handles simple input with no steps", async () => {
    source = join(__dirname, "./input/codeFile.js");
    destination = dirname(source) + "/output";
    stepOutputPath = destination + "/steps";
    codeOutputPath = destination + "/code";

    const actual = createFileInfoArray({
      source,
      stages,
      stepOutputPath,
      codeOutputPath,
    });
    const expected = [
      {
        codeBlock: {
          final: `${destination}/code/final/codeFile.codeblock`,
          start: `${destination}/code/start/codeFile.codeblock`,
        },
        final: `${destination}/code/final/codeFile.js`,
        source,
        start: `${destination}/code/start/codeFile.js`,
        step: `${destination}/steps/codeFile.step.rst`,
      },
    ];

    expect(actual).toStrictEqual(expected);
  });

  it("handles step files", async () => {
    source = join(__dirname, "./input/stepFileWithCode.js");
    destination = dirname(source) + "/output";
    stepOutputPath = destination + "/steps";
    codeOutputPath = destination + "/code";

    const actual = createFileInfoArray({
      source,
      stages,
      stepOutputPath,
      codeOutputPath,
    });
    const expected = [
      {
        source,
        step: `${destination}/steps/stepFileWithCode.step.rst`,
        codeBlock: {
          start: `${destination}/code/start/stepFileWithCode.codeblock`,
          final: `${destination}/code/final/stepFileWithCode.codeblock`,
        },
        start: `${destination}/code/start/stepFileWithCode.js`,
        final: `${destination}/code/final/stepFileWithCode.js`,
      },
    ];

    expect(actual).toStrictEqual(expected);
  });

  it("handles entire directories by returning and empty array denoting a TODO", async () => {
    source = join(__dirname, "./input");
    destination = dirname(source) + "output";
    stepOutputPath = destination + "/steps";
    codeOutputPath = destination + "/code";

    const actual = createFileInfoArray({
      source,
      stages,
      stepOutputPath,
      codeOutputPath,
    });
    const expected = [];
    expect(actual).toStrictEqual(expected);
  });
});
