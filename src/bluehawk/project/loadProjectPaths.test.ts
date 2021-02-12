import * as Path from "path";
import { System } from "../io/System";
import { MockFs } from "../io/MockFs";
import { loadProjectPaths } from "./loadProjectPaths";

describe("loadProjectPaths", () => {
  System.fs = MockFs;

  it("loads project paths", async (done) => {
    MockFs.reset();
    System.fs.mkdir(Path.resolve("virtual/testProject/test"));
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
