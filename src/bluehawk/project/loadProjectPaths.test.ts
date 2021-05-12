import * as Path from "path";
import { System } from "../io/System";
import { loadProjectPaths } from "./loadProjectPaths";

beforeEach(System.useMemfs);

describe("loadProjectPaths", () => {
  it("loads project paths", async () => {
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

    // paths actually contain full filesystem path, so just checking the suffix
    expect(paths[0].endsWith("test/foo.txt")).toBeTruthy();
  });

  it("loads files", async () => {
    System.fs.mkdir(Path.resolve("/path/to/project/test/"), {
      recursive: true,
    });
    System.fs.writeFile(
      Path.resolve("/path/to/project/test/foo.txt"),
      "hello, world!"
    );
    const paths = await loadProjectPaths({
      rootPath: "/path/to/project/test/foo.txt",
    });

    expect(
      await loadProjectPaths({
        rootPath: "/path/to/project",
      })
    ).toStrictEqual(["/path/to/project/test/foo.txt"]);
  });

  it("ignores specified paths", async () => {
    System.useJsonFs({
      "/path/to/project/a.txt": "",
      "/path/to/project/b.txt": "",
      "/path/to/project/c.json": "",
      "/path/to/project/d.json": "",
      "/path/to/project/foo/d.json": "",
      "/path/to/project/foo/d.txt": "",
      "/path/to/project/foo/e.txt": "",
    });

    expect(
      await loadProjectPaths({
        rootPath: "/path/to/project",
      })
    ).toStrictEqual([
      "/path/to/project/a.txt",
      "/path/to/project/b.txt",
      "/path/to/project/c.json",
      "/path/to/project/d.json",
      "/path/to/project/foo/d.json",
      "/path/to/project/foo/d.txt",
      "/path/to/project/foo/e.txt",
    ]);

    expect(
      await loadProjectPaths({
        rootPath: "/path/to/project",
        ignore: "*.txt",
      })
    ).toStrictEqual([
      "/path/to/project/c.json",
      "/path/to/project/d.json",
      "/path/to/project/foo/d.json",
    ]);

    expect(
      await loadProjectPaths({
        rootPath: "/path/to/project",
        ignore: "**/*.json",
      })
    ).toStrictEqual([
      "/path/to/project/a.txt",
      "/path/to/project/b.txt",
      "/path/to/project/foo/d.txt",
      "/path/to/project/foo/e.txt",
    ]);

    expect(
      await loadProjectPaths({
        rootPath: "/path/to/project",
        ignore: ["d.*"],
      })
    ).toStrictEqual([
      "/path/to/project/a.txt",
      "/path/to/project/b.txt",
      "/path/to/project/c.json",
      "/path/to/project/foo/e.txt",
    ]);

    expect(
      await loadProjectPaths({
        rootPath: "/path/to/project",
        ignore: "foo/*.txt",
      })
    ).toStrictEqual([
      "/path/to/project/a.txt",
      "/path/to/project/b.txt",
      "/path/to/project/c.json",
      "/path/to/project/d.json",
      "/path/to/project/foo/d.json",
    ]);
  });

  it("ignores gitignored paths", async () => {
    System.useJsonFs({
      "/path/to/project/.gitignore": `# this is a comment
# b.txt
a.txt
*.json
foo/
`,
      "/path/to/project/a.txt": "",
      "/path/to/project/b.txt": "",
      "/path/to/project/c.json": "",
      "/path/to/project/d.json": "",
      "/path/to/project/foo/d.json": "",
      "/path/to/project/foo/d.txt": "",
      "/path/to/project/foo/e.txt": "",
      "/path/to/project/bar/.gitignore": `*.gif
`,
      "/path/to/project/bar/bar.txt": "",
      "/path/to/project/bar/a.gif": "",
      "/path/to/project/foo/c.txt": "",
    });

    expect(
      await loadProjectPaths({
        rootPath: "/path/to/project",
      })
    ).toStrictEqual([
      "/path/to/project/.gitignore",
      // "a.txt", // ignored
      "/path/to/project/b.txt",
      "/path/to/project/bar/.gitignore",
      "/path/to/project/bar/bar.txt",
      // "bar/a.gif",
      // "c.json", // ignored
      // "d.json", // ignored
      // "foo/c.txt", // foo/ ignored
      // "foo/d.json", // ignored
      // "foo/d.txt",
      // "foo/e.txt",
    ]);
  });
});
