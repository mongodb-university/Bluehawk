import * as Path from "path";
import { System } from "../../bluehawk";
import { copy } from "./copy";

beforeAll(System.useMemfs);
afterAll(System.useRealfs);

describe("copy", () => {
  it("copies", async (done) => {
    const rootPath = Path.resolve("/path/to/project");
    const destinationPath = "/destination";
    await System.fs.mkdir(rootPath, {
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
});
