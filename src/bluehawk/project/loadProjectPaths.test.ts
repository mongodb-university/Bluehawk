import * as Path from "path";
import { System } from "../io/System";
import { loadProjectPaths } from "./loadProjectPaths";

beforeAll(System.useMemfs);
afterAll(System.useRealfs);

describe("loadProjectPaths", () => {
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
