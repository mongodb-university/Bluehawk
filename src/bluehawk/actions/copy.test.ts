import { ConsoleActionReporter } from "./ConsoleActionReporter";
import * as Path from "path";
import { getBluehawk, System } from "../../bluehawk";
import { copy } from "./copy";

describe("copy", () => {
  beforeEach(getBluehawk.reset);
  beforeEach(System.useMemfs);

  it("copies", async () => {
    const rootPath = "/path/to/project";
    const outputPath = "/output";
    await System.fs.mkdir(rootPath, {
      recursive: true,
    });
    await System.fs.mkdir(outputPath, {
      recursive: true,
    });
    await System.fs.writeFile(Path.join(rootPath, "test.txt"), "utf8");
    const reporter = new ConsoleActionReporter();
    await copy({
      reporter,
      output: outputPath,
      rootPath,
      waitForListeners: true,
    });

    expect(reporter.errorCount).toBe(0);
    const sourceList = await System.fs.readdir(rootPath);
    expect(sourceList).toStrictEqual(["test.txt"]);
    const outputList = await System.fs.readdir(outputPath);
    expect(outputList).toStrictEqual(sourceList);
  });

  it("copies binary files", async () => {
    const rootPath = "/path/to/project";
    const outputPath = "/output";
    await System.fs.mkdir(rootPath, {
      recursive: true,
    });
    await System.fs.mkdir(outputPath, {
      recursive: true,
    });
    const filePath = Path.join(rootPath, "test.bin");
    await System.fs.writeFile(filePath, new Uint8Array([0, 1, 2, 3, 4, 5]));
    let didCallBinaryFileForPath: string | undefined = undefined;
    const reporter = new ConsoleActionReporter();
    await copy({
      reporter,
      output: outputPath,
      rootPath,
      onBinaryFile(path) {
        didCallBinaryFileForPath = path;
      },
      waitForListeners: true,
    });

    expect(reporter.errorCount).toBe(0);
    const sourceList = await System.fs.readdir(rootPath);
    expect(sourceList).toStrictEqual(["test.bin"]);
    const outputList = await System.fs.readdir(outputPath);
    expect(outputList).toStrictEqual(sourceList);
    expect(didCallBinaryFileForPath).toBe(filePath);
  });

  it("copies permissions", async () => {
    const rootPath = "/path/to/project";
    const outputPath = "/output";
    await System.fs.mkdir(rootPath, {
      recursive: true,
    });
    await System.fs.mkdir(outputPath, {
      recursive: true,
    });
    const binPath = Path.join(rootPath, "test.bin");
    await System.fs.writeFile(binPath, new Uint8Array([0, 1, 2, 3, 4, 5]));
    await System.fs.chmod(binPath, 0o100755);
    const textPath = Path.join(rootPath, "test.sh");
    await System.fs.writeFile(textPath, "# this is a script", "utf8");
    await System.fs.chmod(textPath, 0o100755);
    const reporter = new ConsoleActionReporter();
    await copy({
      reporter,
      output: outputPath,
      rootPath,
      waitForListeners: true,
    });

    expect(reporter.errorCount).toBe(0);
    const sourceList = await System.fs.readdir(rootPath);
    expect(sourceList).toStrictEqual(["test.bin", "test.sh"]);
    const outputList = await System.fs.readdir(outputPath);
    expect(outputList).toStrictEqual(sourceList);
    const modes = [
      await System.fs.stat(Path.join(outputPath, "test.bin")),
      await System.fs.stat(Path.join(outputPath, "test.sh")),
    ].map(({ mode }) => mode);
    expect(modes).toStrictEqual([0o100755, 0o100755]);
  });
});
