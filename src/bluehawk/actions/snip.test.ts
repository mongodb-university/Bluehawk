import { ConsoleActionReporter } from "./ConsoleActionReporter";
import * as Path from "path";
import { getBluehawk, System } from "../../bluehawk";
import { snip } from "./snip";

describe("snip", () => {
  beforeEach(getBluehawk.reset);
  beforeEach(System.useMemfs);

  const reporter = new ConsoleActionReporter();

  it("generates correct RST snippets AND docusaurus snippets", async (done) => {
    const rootPath = Path.resolve("/path/to/project");
    const outputPath = "/output";
    const testFileName = "test.js";

    await System.fs.mkdir(rootPath, {
      recursive: true,
    });
    await System.fs.mkdir(outputPath, {
      recursive: true,
    });
    await System.fs.writeFile(
      Path.join(rootPath, testFileName),
      `        // :snippet-start: foo
        const bar = "foo"
        // :emphasize-start:
        describe("some stuff", () => {
          it("foos the bar", () => {
            expect(true).toBeTruthy();
          });
        });
        // :emphasize-end:
        console.log(bar);
        // :snippet-end:
    `,
      {
        encoding: "utf8",
      }
    );

    await snip({
      reporter,
      paths: [rootPath],
      output: outputPath,
      state: undefined,
      ignore: undefined,
      format: ["rst", "docusaurus"],
      waitForListeners: true,
    });

    const outputList = await System.fs.readdir(outputPath);
    expect(outputList).toStrictEqual([
      "test.snippet.foo.js",
      "test.snippet.foo.js.snippet.md",
      "test.snippet.foo.js.snippet.rst",
    ]);

    const rstFileContents = await System.fs.readFile(
      Path.join(outputPath, "test.snippet.foo.js.snippet.rst"),
      "utf8"
    );
    expect(rstFileContents).toStrictEqual(`.. snippet:: javascript
   :emphasize-lines: 2-6

   const bar = "foo"
   describe("some stuff", () => {
     it("foos the bar", () => {
       expect(true).toBeTruthy();
     });
   });
   console.log(bar);
`);

    const mdFileContents = await System.fs.readFile(
      Path.join(outputPath, "test.snippet.foo.js.snippet.md"),
      "utf8"
    );
    expect(mdFileContents).toStrictEqual(`const bar = "foo"
// highlight-start
describe("some stuff", () => {
  it("foos the bar", () => {
    expect(true).toBeTruthy();
  });
});
// highlight-end
console.log(bar);
`);
    done();
  });

  it("generates correct Python snippets", async (done) => {
    const rootPath = Path.resolve("/path/to/project");
    const outputPath = "/output";
    const testFileName = "test.py";

    await System.fs.mkdir(rootPath, {
      recursive: true,
    });
    await System.fs.mkdir(outputPath, {
      recursive: true,
    });
    const state = "test-state";
    await System.fs.writeFile(
      Path.join(rootPath, testFileName),
      `# :snippet-start: foo
start=1
# :state-start: ${state}
print("this shouldn't get removed#:remove:")
print('neither should this \\'get removed#:remove:')
print('this should' + "get removed") #:remove:
'''
this must show up # :remove:
this also
\\''' i should stay # :remove:
'\\'' me too # :remove:
''\\' this too # :remove
'''
"""
this must show up # :remove:
\\""" i should stay # :remove:
"\\"" me too # :remove:
""\\" this too # :remove:
''' me too # :remove:
"""
# :state-end:
# :state-start: ${state + "-not"}
"Shouldnt print"
# :state-end:
dont_look_at_me = True # :remove:
# :snippet-end:
    `,
      {
        encoding: "utf8",
      }
    );

    await snip({
      reporter,
      paths: [rootPath],
      output: outputPath,
      state: state,
      ignore: undefined,
      waitForListeners: true,
    });

    const outputList = await System.fs.readdir(outputPath);
    expect(outputList).toStrictEqual(["test.snippet.foo.py"]);

    const rstFileContents = await System.fs.readFile(
      Path.join(outputPath, "test.snippet.foo.py"),
      "utf8"
    );
    expect(rstFileContents).toStrictEqual(`start=1
print("this shouldn't get removed#:remove:")
print('neither should this \\'get removed#:remove:')
'''
this must show up # :remove:
this also
\\''' i should stay # :remove:
'\\'' me too # :remove:
''\\' this too # :remove
'''
"""
this must show up # :remove:
\\""" i should stay # :remove:
"\\"" me too # :remove:
""\\" this too # :remove:
''' me too # :remove:
"""
`);
    done();
  });

  it("generates correct docusarus-formatted code blocks for start and end blocks at the beginning and end of the block", async (done) => {
    const rootPath = Path.resolve("/path/to/project");
    const outputPath = "/output";
    const testFileName = "test.js";

    await System.fs.mkdir(rootPath, {
      recursive: true,
    });
    await System.fs.mkdir(outputPath, {
      recursive: true,
    });
    await System.fs.writeFile(
      Path.join(rootPath, testFileName),
      `// :snippet-start: foo
// :emphasize-start:
const bar = "foo"
describe("some stuff", () => {
  it("foos the bar", () => {
    expect(true).toBeTruthy();
  });
});
console.log(bar);
// :emphasize-end:
// :snippet-end:
    `,
      {
        encoding: "utf8",
      }
    );

    await snip({
      reporter,
      paths: [rootPath],
      output: outputPath,
      state: undefined,
      ignore: undefined,
      format: "docusaurus",
      waitForListeners: true,
    });

    const outputList = await System.fs.readdir(outputPath);
    expect(outputList).toStrictEqual([
      "test.snippet.foo.js",
      "test.snippet.foo.js.snippet.md",
    ]);

    const fileContents = await System.fs.readFile(
      Path.join(outputPath, "test.snippet.foo.js.snippet.md"),
      "utf8"
    );
    expect(fileContents).toStrictEqual(`// highlight-start
const bar = "foo"
describe("some stuff", () => {
  it("foos the bar", () => {
    expect(true).toBeTruthy();
  });
});
console.log(bar);
// highlight-end
`);
    done();
  });

  it("correctly logics multiple ranges within RST snippets", async () => {
    const rootPath = Path.resolve("/path/to/project");
    const outputPath = "/outputB";
    const testFileName = "test.js";

    await System.fs.mkdir(rootPath, {
      recursive: true,
    });
    await System.fs.mkdir(outputPath, {
      recursive: true,
    });
    await System.fs.writeFile(
      Path.join(rootPath, testFileName),
      `// :snippet-start: foo
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
// :snippet-end:
`,
      {
        encoding: "utf8",
      }
    );

    await snip({
      reporter,
      paths: [rootPath],
      output: outputPath,
      state: undefined,
      ignore: undefined,
      format: "rst",
      waitForListeners: true,
    });
    const outputList = await System.fs.readdir(outputPath);
    expect(outputList).toStrictEqual([
      "test.snippet.foo.js",
      "test.snippet.foo.js.snippet.rst",
    ]);

    const fileContents = await System.fs.readFile(
      Path.join(outputPath, "test.snippet.foo.js.snippet.rst"),
      "utf8"
    );
    expect(fileContents).toStrictEqual(`.. snippet:: javascript
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

  it("correctly logics multiple ranges within Docusaurus snippets", async () => {
    const rootPath = Path.resolve("/path/to/project");
    const outputPath = "/outputB";
    const testFileName = "test.js";

    await System.fs.mkdir(rootPath, {
      recursive: true,
    });
    await System.fs.mkdir(outputPath, {
      recursive: true,
    });
    await System.fs.writeFile(
      Path.join(rootPath, testFileName),
      `// :snippet-start: foo
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
// :snippet-end:
`,
      {
        encoding: "utf8",
      }
    );

    await snip({
      reporter,
      paths: [rootPath],
      output: outputPath,
      state: undefined,
      ignore: undefined,
      format: "docusaurus",
      waitForListeners: true,
    });

    const outputList = await System.fs.readdir(outputPath);
    expect(outputList).toStrictEqual([
      "test.snippet.foo.js",
      "test.snippet.foo.js.snippet.md",
    ]);

    const fileContents = await System.fs.readFile(
      Path.join(outputPath, "test.snippet.foo.js.snippet.md"),
      "utf8"
    );
    expect(fileContents).toStrictEqual(`line 1
line 2
// highlight-start
line 3
// highlight-end
line 4
// highlight-start
line 5 
// highlight-end
line 6
// highlight-start
line 7
line 8
// highlight-end
line 9
`);
  });

  it("handles carriage returns", async () => {
    const text = `            //:snippet-start:foo
            var harrysStrat = realm.All<Guitar>().FirstOrDefault(\r
                g => g.Owner == "D. Gilmour"
                  && g.Make == "Fender"
                  && g.Model == "Stratocaster");

            realm.Write(() =>
            {
                harrysStrat.Price = 322.56;
            });
            //:snippet-end:

`;
    const rootPath = "/path/to/project";
    const outputPath = "/carriageReturns";
    const testFileName = "test.js";

    await System.fs.mkdir(rootPath, {
      recursive: true,
    });
    await System.fs.mkdir(outputPath, {
      recursive: true,
    });
    await System.fs.writeFile(Path.join(rootPath, testFileName), text, "utf8");

    await snip({
      reporter,
      paths: [rootPath],
      output: outputPath,
      waitForListeners: true,
    });

    const outputList = await System.fs.readdir(outputPath);
    expect(outputList).toStrictEqual(["test.snippet.foo.js"]);

    const fileContents = await System.fs.readFile(
      Path.join(outputPath, "test.snippet.foo.js"),
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
    const text = `// :snippet-start: content-view
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
// :snippet-end:
`;
    const rootPath = "/path/to/project";
    const outputPathSync = "/stateAndEmphasize/sync";
    const outputPathLocal = "/stateAndEmphasize/local";
    const testFileName = "test.swift";

    await System.fs.mkdir(rootPath, {
      recursive: true,
    });
    await System.fs.mkdir(outputPathSync, {
      recursive: true,
    });
    await System.fs.mkdir(outputPathLocal, {
      recursive: true,
    });
    await System.fs.writeFile(Path.join(rootPath, testFileName), text, "utf8");

    await snip({
      reporter,
      paths: [rootPath],
      output: outputPathSync,
      format: "rst",
      state: "sync",
    });
    await snip({
      reporter,
      paths: [rootPath],
      output: outputPathLocal,
      format: "rst",
      state: "local",
    });

    let fileContentsSync = await System.fs.readFile(
      Path.join(outputPathSync, "test.snippet.content-view.swift"),
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
        outputPathSync,
        "test.snippet.content-view.swift.snippet.rst"
      ),
      "utf8"
    );
    expect(fileContentsSync).toStrictEqual(
      `.. snippet:: swift
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
        outputPathLocal,
        "test.snippet.content-view.swift.snippet.rst"
      ),
      "utf8"
    );
    // TODO: Expect this not to emphasize lines, since the :emphasize: tag was
    // completely in the other state
    /*
  expect(fileContentsLocal).toStrictEqual(
    `.. snippet:: swift
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

  it("handles states when no state is specified", async () => {
    const text = `// Used in quickstart
// :snippet-start: define-model
// :state-start: dart
import 'package:realm_dart/realm.dart';
// :state-end:

// :state-start: flutter
// :state-uncomment-start: flutter
// import 'package:realm/realm.dart';
// :state-uncomment-end:
// :state-end:

part 'define_realm_model_test.g.dart'; // :remove:
// :uncomment-start:
// part 'car.g.dart';
// :uncomment-end:

@RealmModel()
class _Car {
  @PrimaryKey()
  late String make;

  late String? model;
  late int? miles;
}
// :snippet-end:

main() {}
`;
    const rootPath = "/path/to/project";
    const outputPath = "/output";
    const testFileName = "test.dart";

    await System.fs.mkdir(rootPath, {
      recursive: true,
    });
    await System.fs.mkdir(outputPath, {
      recursive: true,
    });
    await System.fs.writeFile(Path.join(rootPath, testFileName), text, "utf8");

    let fileCount = 0;
    await snip({
      reporter: {
        ...reporter,
        errorCount: 0,
        onFileWritten() {
          fileCount++;
        },
      },
      paths: [rootPath],
      output: outputPath,
    });

    let fileContents = await System.fs.readFile(
      Path.join(outputPath, "test.snippet.define-model.dart"),
      "utf8"
    );
    console.log(fileContents);
    expect(fileContents).toBe(
      `

part 'car.g.dart';

@RealmModel()
class _Car {
  @PrimaryKey()
  late String make;

  late String? model;
  late int? miles;
}
`
    );
    // Don't write a file for each state (old bug)
    expect(fileCount).toBe(1);
  });

  it("handles the --id option with multiple args", async () => {
    const snippet_1 = "id-1";
    const snippet_2 = "id-2";
    const snippet_3 = "id-3-should-not-snip";
    const text = `
    // :snippet-start: ${snippet_1}
    hi
    // :snippet-end:
    /* :snippet-start: ${snippet_2} */
    bye
    /* :snippet-end: */
    // :snippet-start: ${snippet_3}
    should not snip
    // :snippet-end:
`;
    const rootPath = "/path/to/project";
    const snippetName1 = `test.snippet.${snippet_1}.js`;
    const snippetName2 = `test.snippet.${snippet_2}.js`;
    const outputPathLocal = "/stateAndEmphasize/local";
    const testFileName = "test.js";

    await System.fs.mkdir(rootPath, {
      recursive: true,
    });
    await System.fs.mkdir(outputPathLocal, {
      recursive: true,
    });
    await System.fs.writeFile(Path.join(rootPath, testFileName), text, "utf8");

    await snip({
      reporter,
      paths: [rootPath],
      output: outputPathLocal,
      id: [snippet_1, snippet_2],
    });

    const fileContents1Sync = await System.fs.readFile(
      Path.join(outputPathLocal, snippetName1),
      "utf8"
    );
    const fileContents2Sync = await System.fs.readFile(
      Path.join(outputPathLocal, snippetName2),
      "utf8"
    );

    const allFilesInDest = await System.fs.readdir(outputPathLocal);
    // Verify that only the snippet with the requested ID was produced
    expect(allFilesInDest).toStrictEqual([snippetName1, snippetName2]);
    // Verify that the contents of the requested snippet is correct
    expect(fileContents1Sync).toStrictEqual("hi\n");
    expect(fileContents2Sync).toStrictEqual("bye\n");
  });
});
