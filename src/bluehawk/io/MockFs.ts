import { strict as assert } from "assert";
import { PathLike, Stats } from "fs";
import * as Path from "path";
import { FileSystem } from "./System";

// Minimal implementation of a virtual filesystem for unit testing purposes.

export type MockFile = {
  basename: string;
  type: "file";
  contents: string;
};

export type MockDirectory = {
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
  if (path === Path.sep) {
    return root;
  }
  const segments = Path.resolve(path as string).split(Path.sep);
  const basename = segments.pop();
  assert(basename !== undefined);
  let current: MockDirectory | MockFile | undefined = root;
  segments.shift();
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

// Assign this to System.fs to use in unit tests.
export const MockFs: FileSystem & {
  reset: () => void;
  find: (path?: string) => string[];
} = {
  // "Delete" "everything" in the mock file system
  reset: () => {
    root.contents = new Map();
  },
  // Recursively list all paths from the given root path
  find: (path) => {
    const find = (path: string): string[] => {
      const e = access(path);
      if (e.type === "file") {
        return [path];
      }
      return [
        path,
        ...Array.from(e.contents.values()).map((child) => {
          const childPath = Path.join(path, child.basename);
          assert(childPath !== path);
          return find(childPath);
        }),
      ].flat();
    };
    return find(path ?? Path.sep);
  },
  copyFile: async (src, dest, flags) => {
    const file = access(src);
    if (file.type !== "file") {
      throw new Error(`cannot copy ${src}: not a file`);
    }
    try {
      const maybeDestination = access(dest);
      switch (maybeDestination.type) {
        case "directory":
          // Destination is a directory, so use original name
          maybeDestination.contents.set(file.basename, file);
          break;
        case "file":
          // Destination is an existing file, so overwrite it
          maybeDestination.contents = file.contents;
          break;
      }
    } catch {
      // Destination does not exist as such, so get the directory
      const destinationDirectory = Path.dirname(dest as string);
      const maybeDestination = access(destinationDirectory);
      if (maybeDestination.type !== "directory") {
        throw new Error(
          `cannot copy file ${src}: destination ${destinationDirectory} is not a directory`
        );
      }
      const basename = Path.basename(dest as string);
      maybeDestination.contents.set(basename, {
        ...file,
        basename,
      });
    }
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
    segments.shift();
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
