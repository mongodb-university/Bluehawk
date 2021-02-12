import { MockFs } from "./MockFs";
import * as Path from "path";

describe("MockFs", () => {
  it("lists files", () => {
    expect(MockFs.find()).toStrictEqual([Path.sep]);

    MockFs.mkdir(Path.join(Path.sep, "foo", "bar", "baz"), { recursive: true });
    expect(MockFs.find()).toStrictEqual([
      Path.sep,
      Path.join(Path.sep, "foo"),
      Path.join(Path.sep, "foo", "bar"),
      Path.join(Path.sep, "foo", "bar", "baz"),
    ]);

    MockFs.writeFile(Path.join(Path.sep, "foo", "bar", "test.txt"), "hello");

    expect(MockFs.find()).toStrictEqual([
      Path.sep,
      Path.join(Path.sep, "foo"),
      Path.join(Path.sep, "foo", "bar"),
      Path.join(Path.sep, "foo", "bar", "baz"),
      Path.join(Path.sep, "foo", "bar", "test.txt"),
    ]);

    expect(MockFs.find(Path.join(Path.sep, "foo", "bar"))).toStrictEqual([
      Path.join(Path.sep, "foo", "bar"),
      Path.join(Path.sep, "foo", "bar", "baz"),
      Path.join(Path.sep, "foo", "bar", "test.txt"),
    ]);
  });

  it("copies files", async (done) => {
    MockFs.reset();
    expect(MockFs.find()).toStrictEqual([Path.sep]);
    const path1 = Path.join(Path.sep, "foo", "bar", "test.txt");
    const path2 = Path.join(Path.sep, "foo");
    const path3 = Path.join(Path.sep, "foo", "test2.txt");
    await MockFs.mkdir(Path.dirname(path1), { recursive: true });
    await MockFs.writeFile(path1, "hello, world!");
    expect(await MockFs.readFile(path1, "utf8")).toBe("hello, world!");
    await MockFs.copyFile(path1, path2);
    expect(await MockFs.readFile(Path.join(path2, "test.txt"), "utf8")).toBe(
      "hello, world!"
    );
    await MockFs.copyFile(path1, path3);
    expect(await MockFs.readFile(path3, "utf8")).toBe("hello, world!");
    // Overwrite file
    await MockFs.copyFile(path1, path3);
    expect(await MockFs.readFile(path3, "utf8")).toBe("hello, world!");
    expect(MockFs.find()).toStrictEqual([
      Path.sep,
      Path.join(Path.sep, "foo"),
      Path.join(Path.sep, "foo", "bar"),
      path1,
      Path.join(path2, "test.txt"),
      path3,
    ]);

    try {
      await MockFs.copyFile(path1, Path.join(Path.sep, "fizz", "buzz"));
      fail();
    } catch (error) {
      expect(error.message).toBe(
        "accessing /fizz: cannot read 'fizz': file does not exist"
      );
    }

    try {
      await MockFs.copyFile(Path.join(Path.sep, "foo"), path2);
      fail();
    } catch (error) {
      expect(error.message).toBe("cannot copy /foo: not a file");
    }

    try {
      await MockFs.copyFile(
        path1,
        Path.join(Path.sep, "foo", "test.txt", "fail.txt")
      );
      fail();
    } catch (error) {
      expect(error.message).toBe(
        "cannot copy file /foo/bar/test.txt: destination /foo/test.txt is not a directory"
      );
    }

    done();
  });
});
