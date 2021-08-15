import * as Path from "path";
import { getBluehawk, System } from "../../bluehawk";
import { snip } from "./snip";

describe("snip", () => {
  beforeEach(getBluehawk.reset);
  beforeEach(System.useMemfs);

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

    await snip({
      paths: [rootPath],
      destination: destinationPath,
      state: undefined,
      ignore: undefined,
      format: "rst",
      waitForListeners: true,
    });

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

  it("correctly logics multiple ranges within RST snippets", async () => {
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
      format: "rst",
      waitForListeners: true,
    });

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
  });

  it("handles carriage returns", async () => {
    const text = `            //:code-block-start:foo
            var harrysStrat = realm.All<Guitar>().FirstOrDefault(\r
                g => g.Owner == "D. Gilmour"
                  && g.Make == "Fender"
                  && g.Model == "Stratocaster");

            realm.Write(() =>
            {
                harrysStrat.Price = 322.56;
            });
            //:code-block-end:

`;
    const rootPath = "/path/to/project";
    const destinationPath = "/carriageReturns";
    const testFileName = "test.js";

    await System.fs.mkdir(rootPath, {
      recursive: true,
    });
    await System.fs.mkdir(destinationPath, {
      recursive: true,
    });
    await System.fs.writeFile(Path.join(rootPath, testFileName), text, "utf8");

    const errors = await snip({
      paths: [rootPath],
      destination: destinationPath,
      waitForListeners: true,
    });

    expect(errors).toStrictEqual(undefined);
    const destinationList = await System.fs.readdir(destinationPath);
    expect(destinationList).toStrictEqual(["test.codeblock.foo.js"]);

    const fileContents = await System.fs.readFile(
      Path.join(destinationPath, "test.codeblock.foo.js"),
      "utf8"
    );
    expect(JSON.stringify(fileContents)).toStrictEqual(
      JSON.stringify(`var harrysStrat = realm.All<Guitar>().FirstOrDefault(\r
    g => g.Owner == "D. Gilmour"
      && g.Make == "Fender"
      && g.Model == "Stratocaster");

realm.Write(() =>
{
    harrysStrat.Price = 322.56;
});
`)
    );
  });

  it("handles state interplay", async () => {
    const text = `// :code-block-start: content-view
/// The main screen that determines whether to present the SyncContentView or the LocalOnlyContentView.
// :state-start: local
/// For now, it always displays the LocalOnlyContentView.
// :state-end:
@main
struct ContentView: SwiftUI.App {
  var body: some Scene {
      WindowGroup {
          // :state-start: sync
          // :emphasize-start:
          // Using Sync?
          if let app = app {
              SyncContentView(app: app)
          // :emphasize-end:
          } else {
              LocalOnlyContentView()
          }
          // :state-end:
          // :state-uncomment-start: local
          // LocalOnlyContentView()
          // :state-uncomment-end:
      }
  }
}
// :code-block-end:
`;
    const rootPath = "/path/to/project";
    const destinationPathSync = "/stateAndEmphasize/sync";
    const destinationPathLocal = "/stateAndEmphasize/local";
    const testFileName = "test.swift";

    await System.fs.mkdir(rootPath, {
      recursive: true,
    });
    await System.fs.mkdir(destinationPathSync, {
      recursive: true,
    });
    await System.fs.mkdir(destinationPathLocal, {
      recursive: true,
    });
    await System.fs.writeFile(Path.join(rootPath, testFileName), text, "utf8");

    await snip({
      paths: [rootPath],
      destination: destinationPathSync,
      format: "rst",
      state: "sync",
    });
    await snip({
      paths: [rootPath],
      destination: destinationPathLocal,
      format: "rst",
      state: "local",
    });

    let fileContentsSync = await System.fs.readFile(
      Path.join(destinationPathSync, "test.codeblock.content-view.swift"),
      "utf8"
    );
    // Verify states are working in non-rst version
    expect(fileContentsSync).toStrictEqual(
      `/// The main screen that determines whether to present the SyncContentView or the LocalOnlyContentView.
@main
struct ContentView: SwiftUI.App {
  var body: some Scene {
      WindowGroup {
          // Using Sync?
          if let app = app {
              SyncContentView(app: app)
          } else {
              LocalOnlyContentView()
          }
      }
  }
}
`
    );
    // Now check states for rst version
    fileContentsSync = await System.fs.readFile(
      Path.join(
        destinationPathSync,
        "test.codeblock.content-view.swift.code-block.rst"
      ),
      "utf8"
    );
    expect(fileContentsSync).toStrictEqual(
      `.. code-block:: swift
   :emphasize-lines: 6-8

   /// The main screen that determines whether to present the SyncContentView or the LocalOnlyContentView.
   @main
   struct ContentView: SwiftUI.App {
     var body: some Scene {
         WindowGroup {
             // Using Sync?
             if let app = app {
                 SyncContentView(app: app)
             } else {
                 LocalOnlyContentView()
             }
         }
     }
   }
`
    );

    const fileContentsLocal = await System.fs.readFile(
      Path.join(
        destinationPathLocal,
        "test.codeblock.content-view.swift.code-block.rst"
      ),
      "utf8"
    );
    // TODO: Expect this not to emphasize lines, since the :emphasize: command was
    // completely in the other state
    /*
  expect(fileContentsLocal).toStrictEqual(
    `.. code-block:: swift
 /// The main screen that determines whether to present the SyncContentView or the LocalOnlyContentView.
 /// For now, it always displays the LocalOnlyContentView.
 @main
 struct ContentView: SwiftUI.App {
     var body: some Scene {
         WindowGroup {
             LocalOnlyContentView()
         }
     }
 }
 `);
 */
  });
  it("handles the --id option", async () => {
    const text = `
public class Main {
  public static void main(String[] args){
    // :snippet-start: test-block
    System.out.println("1");
    // :snippet-end:
    // :snippet-start: test-block-2
    System.out.println("2");
    // :snippet-end:
  }
}
`;
    const rootPath = "/path/to/project";
    const snippetName = "test.codeblock.test-block.java";
    const destinationPathLocal = "/stateAndEmphasize/local";
    const testFileName = "test.java";

    await System.fs.mkdir(rootPath, {
      recursive: true,
    });
    await System.fs.mkdir(destinationPathLocal, {
      recursive: true,
    });
    await System.fs.writeFile(Path.join(rootPath, testFileName), text, "utf8");

    await snip({
      paths: [rootPath],
      destination: destinationPathLocal,
      id: "test-block",
    });

    let fileContentsSync = await System.fs.readFile(
      Path.join(destinationPathLocal, snippetName),
      "utf8"
    );

    let allFilesInDest = await System.fs.readdir(destinationPathLocal);

    // Verify that only the snippet with the requested ID was produced
    expect(allFilesInDest).toStrictEqual(
      [snippetName]
    );
    // Verify that the contents of the requested snippet is correct
    expect(fileContentsSync).toStrictEqual('System.out.println("1");\n');

  });
  it("handles the --id option with multiple args", async () => {
    const snippet_1 = "id-1"
    const snippet_2 = "id-2"
    const text = `
    // :snippet-start: ${snippet_1}
    hi
    // :snippet-end:
    // :snippet-start: ${snippet_2}
    bye
    // :snippet-end:
`;
    const rootPath = "/path/to/project";
    const snippetName1 = `test.codeblock.${snippet_1}.java`;
    const snippetName2 = `test.codeblock.${snippet_2}.java`;
    const destinationPathLocal = "/stateAndEmphasize/local";
    const testFileName = "test.java";

    await System.fs.mkdir(rootPath, {
      recursive: true,
    });
    await System.fs.mkdir(destinationPathLocal, {
      recursive: true,
    });
    await System.fs.writeFile(Path.join(rootPath, testFileName), text, "utf8");

    await snip({
      paths: [rootPath],
      destination: destinationPathLocal,
      id: [snippet_1,snippet_2],
    });

    let fileContents1Sync = await System.fs.readFile(
      Path.join(destinationPathLocal, snippetName1),
      "utf8"
    );
    let fileContents2Sync = await System.fs.readFile(
      Path.join(destinationPathLocal, snippetName2),
      "utf8"
    );

    let allFilesInDest = await System.fs.readdir(destinationPathLocal);
    // Verify that only the snippet with the requested ID was produced
    expect(allFilesInDest).toStrictEqual(
      [snippetName1, snippetName2]
    );
    // Verify that the contents of the requested snippet is correct
    expect(fileContents1Sync).toStrictEqual('hi\n');
    expect(fileContents2Sync).toStrictEqual('bye\n');

  });
});
