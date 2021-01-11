import * as path from "path";
import * as fs from "fs";
import ignore from "ignore";
import * as readline from "readline";
import { Bluehawk, BluehawkSource } from "../bluehawk";
import { Processor } from "../processors/Processor";
import { SnippetCommand } from "../processors/SnippetCommand";
import { RemoveCommand } from "../processors/RemoveCommand";
import { StateCommand } from "../processors/StateCommand";

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
            console.log(path.resolve(file));
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
  const filePath = file;
  return new BluehawkSource({
    text,
    language,
    filePath,
  });
}

export async function main(source: string, ignores?: string[]): Promise<void> {
  const processor = new Processor();
  processor.registerCommand("code-block", SnippetCommand);
  processor.registerCommand("remove", RemoveCommand);
  processor.registerCommand("state", StateCommand);

  const bluehawk = new Bluehawk();
  const files = await fileEntry(source, ignores);

  files.forEach((file) => {
    const result = bluehawk.run(genSource(file));
    // TODO: remove this error check, informational only during devlopering
    if (result.errors.length > 0) {
      console.error("encountered error in file", file);
      console.error(result.errors[0]);
    }
    processor.process(result);
  });
}
