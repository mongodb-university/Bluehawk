import * as path from "path";
import * as fs from "fs";
import ignore from "ignore";
import * as readline from "readline";
import { Bluehawk } from "../bluehawk";
import { BluehawkSource } from "../BluehawkSource";
import { Listener, Processor, ProcessRequest } from "../processors/Processor";
import { SnippetCommand } from "../processors/SnippetCommand";
import { RemoveCommand } from "../processors/RemoveCommand";
import { StateCommand } from "../processors/StateCommand";
import { UncommentCommand } from "../processors/UncommentCommand";
import { isBinary } from "istextorbinary";

async function fileEntry(
  source: string,
  ignores?: string[]
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const ig = ignore();
    if (!ignores) {
      ignores = [];
    }
    function traverse(source: string, fileArray = []): string[] {
      let files: string[] = [];
      if (fs.lstatSync(path.resolve(source)).isFile()) {
        return [source];
      } else {
        files = fs.readdirSync(source);
      }
      files.forEach((file) => {
        if (
          !ig.ignores(path.relative(process.cwd(), path.join(source, file)))
        ) {
          if (
            fs.lstatSync(path.join(path.resolve(source), file)).isDirectory()
          ) {
            fileArray = traverse(
              path.join(path.resolve(source), file),
              fileArray
            );
          } else {
            fileArray.push(path.join(source, file));
          }
        }
      });
      return fileArray;
    }
    try {
      if (fs.existsSync(path.join(path.resolve(source), ".gitignore"))) {
        const ri = readline.createInterface({
          input: fs.createReadStream(
            path.join(path.resolve(source), ".gitignore")
          ),
        });
        ri.on("line", (line) => {
          if (!(line.startsWith("#") || line.trim().length == 0)) {
            ignores.push(line);
          }
        });
        ri.on("close", () => {
          ig.add(ignores);
          resolve(traverse(source));
        });
      } else {
        ig.add(ignores);
        resolve(traverse(source));
      }
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
}

function genSource(file: string): BluehawkSource {
  const text = fs.readFileSync(path.resolve(file), "utf8");
  const language = path.extname(file);
  return new BluehawkSource({ text, language, path: file });
}

const bluehawk = new Bluehawk();

export async function main(
  source: string,
  ignores: string[] | undefined,
  onFileProcessed: Listener[],
  onBinaryFile?: (path: string) => void
): Promise<void> {
  const processor = new Processor();
  processor.registerCommand("code-block", SnippetCommand);
  processor.registerCommand("snippet", SnippetCommand);
  processor.registerCommand("remove", RemoveCommand);

  // TODO: "hide" is deprecated and "replace-with" will not work as originally
  processor.registerCommand("hide", RemoveCommand);

  // hide and replace-with now belong to "state"
  processor.registerCommand("state", StateCommand);

  // uncomment the block in the state
  processor.registerCommand(
    "state-uncomment",
    (request: ProcessRequest): void => {
      UncommentCommand(request);
      StateCommand(request);
    }
  );

  onFileProcessed.forEach((listener) => processor.subscribe(listener));

  (await fileEntry(source, ignores)).forEach((file) => {
    try {
      if (isBinary(file)) {
        onBinaryFile && onBinaryFile(file);
        return;
      }
      const result = bluehawk.run(genSource(file));
      if (result.errors.length !== 0) {
        console.error(
          `Error in ${file}:\n${result.errors
            .map(
              (error) =>
                `  at line ${error.location.line} col ${error.location.column}: ${error.message}`
            )
            .join("\n")}`
        );
        return;
      }
      processor.process(result);
    } catch (e) {
      console.error(`Encountered the following error while processing ${file}:
${e.stack}

This is probably a bug in Bluehawk. Please send this stack trace (and the contents of ${file}, if possible) to the Bluehawk development team at https://github.com/mongodb-university/Bluehawk/issues/new`);
    }
  });
}
