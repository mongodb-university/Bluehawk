import { Stats } from "fs";
import { System } from "../../bluehawk";
import { snip } from "./snip";

describe("snip", () => {
  it("snips", async (done) => {
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
        console.log(data);
        return;
      },
    };

    const errors = await snip({
      paths: ["/path/to/project"],
      destination: "a",
      plugin: undefined,
      state: undefined,
      ignore: undefined,
    });

    expect(errors).toStrictEqual(undefined);

    done();
  });
});
