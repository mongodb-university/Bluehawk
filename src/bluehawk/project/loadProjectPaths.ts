import * as path from "path";
import * as fs from "fs";
import ignore from "ignore";
import * as readline from "readline";
import { Project } from "./Project";

// Given a source entry point path, load all paths to files within, mindful of
// .gitignore.
export async function loadProjectPaths(project: Project): Promise<string[]> {
  const source = project.rootPath;
  return new Promise((resolve, reject) => {
    const ig = ignore();
    const ignores = project.ignores ?? [];
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
