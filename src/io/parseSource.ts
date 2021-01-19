import * as path from "path";
import * as fs from "fs";
import ignore from "ignore";
import * as readline from "readline";
import { Bluehawk } from "../bluehawk";
import { Document } from "../Document";
import { Listener, ProcessRequest } from "../processor/Processor";
import { SnippetCommand } from "../commands/SnippetCommand";
import { RemoveCommand } from "../commands/RemoveCommand";
import { StateCommand } from "../commands/StateCommand";
import { UncommentCommand } from "../commands/UncommentCommand";
import { isBinary } from "istextorbinary";
import { ReplaceCommand } from "../commands/ReplaceCommand";

async function fileEntry(
  source: string,
  ignoresOrUndefined?: string[]
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const ig = ignore();
    const ignores = ignoresOrUndefined ?? [];
    function traverse(source: string, fileArray = [] as string[]): string[] {
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

function genSource(file: string): Document {
  const text = fs.readFileSync(path.resolve(file), "utf8");
  const language = path.extname(file);
  return new Document({ text, language, path: file });
}

export async function main(
  source: string,
  ignores: string[] | undefined,
  onFileProcessed: Listener[],
  onBinaryFile?: (path: string) => void
): Promise<void> {
  const bluehawk = new Bluehawk();
  bluehawk.registerCommand("code-block", SnippetCommand);
  bluehawk.registerCommand("replace", ReplaceCommand);
  bluehawk.registerCommand("snippet", SnippetCommand);
  bluehawk.registerCommand("remove", RemoveCommand);

  // TODO: "hide" is deprecated and "replace-with" will not work as originally
  bluehawk.registerCommand("hide", RemoveCommand);

  // hide and replace-with now belong to "state"
  bluehawk.registerCommand("state", StateCommand);

  // uncomment the block in the state
  bluehawk.registerCommand("state-uncomment", {
    rules: [...StateCommand.rules],
    process: (request: ProcessRequest): void => {
      UncommentCommand.process(request);
      StateCommand.process(request);
    },
  });

  onFileProcessed.forEach((listener) => bluehawk.subscribe(listener));

  const files = await fileEntry(source, ignores);

  const promises = files.map(async (file) => {
    try {
      if (isBinary(file)) {
        onBinaryFile && onBinaryFile(file);
        return;
      }
      const result = bluehawk.parse(genSource(file));
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
      await bluehawk.process(result);
    } catch (e) {
      console.error(`Encountered the following error while processing ${file}:
${e.stack}

This is probably a bug in Bluehawk. Please send this stack trace (and the contents of ${file}, if possible) to the Bluehawk development team at https://github.com/mongodb-university/Bluehawk/issues/new`);
    }
  });
  await Promise.all(promises);
}
