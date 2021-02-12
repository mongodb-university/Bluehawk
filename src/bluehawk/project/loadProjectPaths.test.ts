import * as Path from "path";
import { FileSystem, System } from "../io/System";
import { loadProjectPaths } from "./loadProjectPaths";
import { fs } from "memfs";

describe("loadProjectPaths", () => {
  System.fs = fs.promises as FileSystem;

  it("loads project paths", async (done) => {
    System.fs.mkdir(Path.resolve("virtual/testProject/test"), {
      recursive: true,
    });
    System.fs.writeFile(
      Path.resolve("virtual/testProject/test/foo.txt"),
      "hello, world!"
    );
    const paths = await loadProjectPaths({
      rootPath: "virtual/testProject",
    });

    expect(paths).toStrictEqual(["virtual/testProject/test/foo.txt"]);

    done();
  });
});
