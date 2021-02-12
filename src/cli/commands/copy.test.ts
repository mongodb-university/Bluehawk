import { Stats } from "fs";
import { System } from "../../bluehawk";
import { copy } from "./copy";

describe("copy", () => {
  it("copies", async (done) => {
    System.fs = {
      copyFile: async (src, dest, flags) => {
        return;
      },
      lstat: async (path) => {
        return ({
          isDirectory() {
            return false;
          },
          isFile() {
            return false;
          },
        } as unknown) as Stats;
      },
      mkdir: async (path, options) => {
        return;
      },
      readdir: async (path, options) => {
        return [];
      },
      readFile: async (path, options) => {
        return "";
      },
      writeFile: async (path, data, options) => {
        return;
      },
    };

    const errors = await copy({
      destination: "a",
      rootPath: "/path/to/project",
    });

    expect(errors).toStrictEqual([]);

    done();
  });
});
