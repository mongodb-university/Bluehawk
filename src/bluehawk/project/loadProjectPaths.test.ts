import { strict as assert } from "assert";
import { PathLike, Stats } from "fs";
import * as Path from "path";
import { System } from "../System";
import { loadProjectPaths } from "./loadProjectPaths";

type MockFile = {
  basename: string;
  type: "file";
  contents: string;
};

type MockDirectory = {
  basename: string;
  type: "directory";
  contents: Map<string, MockFile | MockDirectory>;
};

const root: MockDirectory = {
  type: "directory",
  contents: new Map(),
  basename: "__root__",
};

const access = (path: PathLike): MockFile | MockDirectory => {
  const segments = Path.resolve(path as string).split(Path.sep);
  const basename = segments.pop();
  assert(basename !== undefined);
  let current: MockDirectory | MockFile | undefined = root;
  segments.forEach((segment) => {
    assert(current !== undefined);
    if (current.type !== "directory" || !current.contents.has(segment)) {
      throw new Error(
        `accessing ${path}: cannot enter '${segment}': not a directory`
      );
    }
    current = current.contents.get(segment);
    assert(current !== undefined);
    assert(current.basename === segment);
  });
  if (!current.contents.has(basename)) {
    throw new Error(
      `accessing ${path}: cannot read '${basename}': file does not exist`
    );
  }
  const file = current.contents.get(basename);
  assert(file !== undefined);
  assert(file.basename === basename);
  return file;
};

System.fs = {
  copyFile: async (src, dest, flags) => {
    // TODO
    return;
  },
  lstat: async (path) => {
    const file = access(path);
    return ({
      isDirectory() {
        return file.type === "directory";
      },
      isFile() {
        return file.type === "file";
      },
    } as unknown) as Stats;
  },
  mkdir: async (path, options) => {
    const segments = Path.resolve(path as string).split(Path.sep);
    let current: MockDirectory | MockFile | undefined = root;
    segments.forEach((segment) => {
      assert(current !== undefined);
      if (current.type === "file") {
        throw new Error(
          `mkdir ${path}: cannot write '${segment}': file exists`
        );
      }
      if (!current.contents.has(segment)) {
        current.contents.set(segment, {
          basename: segment,
          contents: new Map(),
          type: "directory",
        });
      }
      current = current.contents.get(segment);
    });
  },
  readdir: async (path, options) => {
    const dir = access(path);
    if (dir.type !== "directory") {
      throw new Error(`readdir ${path} failed: not a directory`);
    }
    return Array.from(dir.contents.values()).map((entry) => entry.basename);
  },
  readFile: async (path, options) => {
    const file = access(path);
    if (file.type !== "file") {
      throw new Error(`readFile ${path} failed: not a file`);
    }
    return file.contents;
  },
  writeFile: async (path, data, options) => {
    const directory = access(Path.dirname(path as string));
    if (directory.type !== "directory") {
      throw new Error(`writeFile ${path} failed: directory does not exist`);
    }
    const basename = Path.basename(path as string);
    directory.contents.set(basename, {
      basename,
      contents: data as string,
      type: "file",
    });
  },
};

describe("loadProjectPaths", () => {
  it("loads project paths", async (done) => {
    root.contents = new Map();
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
