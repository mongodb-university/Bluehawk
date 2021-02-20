import * as Path from "path";
import { System } from "../../bluehawk";
import { snip } from "./snip";

beforeAll(System.useMemfs);
afterAll(System.useRealfs);

describe("snip", () => {
  it("generates correct RST snippets", async (done) => {
    const rootPath = Path.resolve("/path/to/project");
    const destinationPath = "/destination";
    const testFileName = "test.js";

    await System.fs.mkdir(rootPath, {
      recursive: true,
    });
    await System.fs.mkdir(destinationPath, {
      recursive: true,
    });
    await System.fs.writeFile(
      Path.join(rootPath, testFileName),
      `        // :code-block-start: foo
        const bar = "foo"
        // :emphasize-start:
        describe("some stuff", () => {
          it("foos the bar", () => {
            expect(true).toBeTruthy();
          });
        });
        // :emphasize-end:
        console.log(bar);
        // :code-block-end:
    `,
      {
        encoding: "utf8",
      }
    );

    const errors = await snip({
      paths: [rootPath],
      destination: destinationPath,
      state: undefined,
      ignore: undefined,
      format: "sphynx-rst",
    });

    function delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    await delay(3000); // silly i know but we need to wait for the file to write to the read-only filesystem

    expect(errors).toStrictEqual(undefined);
    const destinationList = await System.fs.readdir(destinationPath);
    expect(destinationList).toStrictEqual([
      "test.codeblock.foo.js",
      "test.codeblock.foo.js.code-block.rst",
    ]);

    const fileContents = await System.fs.readFile(
      Path.join(destinationPath, "test.codeblock.foo.js.code-block.rst"),
      "utf8"
    );
    expect(fileContents).toStrictEqual(`.. code-block:: javascript
   :emphasize-lines: 2-6

   const bar = "foo"
   describe("some stuff", () => {
     it("foos the bar", () => {
       expect(true).toBeTruthy();
     });
   });
   console.log(bar);
`);
    done();
  });

  it("correctly logics multiple ranges within RST snippets", async (done) => {
    const rootPath = Path.resolve("/path/to/project");
    const destinationPath = "/destinationB";
    const testFileName = "test.js";

    await System.fs.mkdir(rootPath, {
      recursive: true,
    });
    await System.fs.mkdir(destinationPath, {
      recursive: true,
    });
    await System.fs.writeFile(
      Path.join(rootPath, testFileName),
      `// :code-block-start: foo
line 1
line 2
// :emphasize-start:
line 3
// :emphasize-end:
line 4
line 5 // :emphasize:
line 6
// :emphasize-start:
line 7
line 8
// :emphasize-end:
line 9
// :code-block-end:
`,
      {
        encoding: "utf8",
      }
    );

    const errors = await snip({
      paths: [rootPath],
      destination: destinationPath,
      state: undefined,
      ignore: undefined,
      format: "sphynx-rst",
    });

    function delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    await delay(3000); // silly i know but we need to wait for the file to write to the read-only filesystem

    expect(errors).toStrictEqual(undefined);
    const destinationList = await System.fs.readdir(destinationPath);
    expect(destinationList).toStrictEqual([
      "test.codeblock.foo.js",
      "test.codeblock.foo.js.code-block.rst",
    ]);

    const fileContents = await System.fs.readFile(
      Path.join(destinationPath, "test.codeblock.foo.js.code-block.rst"),
      "utf8"
    );
    expect(fileContents).toStrictEqual(`.. code-block:: javascript
   :emphasize-lines: 3, 5, 7-8

   line 1
   line 2
   line 3
   line 4
   line 5 
   line 6
   line 7
   line 8
   line 9
`);
    done();
  });
});
