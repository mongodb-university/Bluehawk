import * as Path from "path";
import { getBluehawk, System } from "../../bluehawk";
import { copy } from "./copy";

describe("copy", () => {
  beforeEach(getBluehawk.reset);
  beforeEach(System.useMemfs);

  it("copies", async (done) => {
    const rootPath = "/path/to/project";
    const destinationPath = "/destination";
    await System.fs.mkdir(rootPath, {
      recursive: true,
    });
    await System.fs.mkdir(destinationPath, {
      recursive: true,
    });
    await System.fs.writeFile(Path.join(rootPath, "test.txt"), "utf8");
    const errors = await copy({
      destination: destinationPath,
      rootPath,
    });

    expect(errors).toStrictEqual([]);
    const sourceList = await System.fs.readdir(rootPath);
    expect(sourceList).toStrictEqual(["test.txt"]);
    const destinationList = await System.fs.readdir(destinationPath);
    expect(destinationList).toStrictEqual(sourceList);
    done();
  });

  it("copies binary files", async () => {
    const rootPath = "/path/to/project";
    const destinationPath = "/destination";
    await System.fs.mkdir(rootPath, {
      recursive: true,
    });
    await System.fs.mkdir(destinationPath, {
      recursive: true,
    });
    const filePath = Path.join(rootPath, "test.bin");
    await System.fs.writeFile(filePath, new Uint8Array([0, 1, 2, 3, 4, 5]));
    let didCallBinaryFileForPath: string | undefined = undefined;
    const errors = await copy({
      destination: destinationPath,
      rootPath,
      onBinaryFile(path) {
        didCallBinaryFileForPath = path;
      },
    });

    expect(errors).toStrictEqual([]);
    const sourceList = await System.fs.readdir(rootPath);
    expect(sourceList).toStrictEqual(["test.bin"]);
    const destinationList = await System.fs.readdir(destinationPath);
    expect(destinationList).toStrictEqual(sourceList);
    expect(didCallBinaryFileForPath).toBe(filePath);
  });
});
