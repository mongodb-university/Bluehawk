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
      format: "rst",
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
});
