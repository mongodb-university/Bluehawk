import * as path from "path";
import ignore from "ignore";
import { Project } from "./Project";
import { System } from "../System";

// Given a source entry point path, load all paths to files within, mindful of
// .gitignore.
export async function loadProjectPaths(project: Project): Promise<string[]> {
  const source = project.rootPath;
  const ig = ignore();
  const ignores = Array.isArray(project.ignore)
    ? project.ignore
    : typeof project.ignore === "string"
    ? [project.ignore]
    : [];

  async function traverse(source: string): Promise<string[]> {
    const stats = await System.fs.lstat(path.resolve(source));
    if (stats.isFile()) {
      return [source];
    }
    if (!stats.isDirectory()) {
      return [];
    }
    const files = await System.fs.readdir(source);
    const promises = files.map(
      async (file): Promise<string[]> => {
        if (ig.ignores(path.relative(process.cwd(), path.join(source, file)))) {
          return [];
        }
        return await traverse(path.join(path.resolve(source), file));
      }
    );
    return (await Promise.all(promises)).flat();
  }

  const gitignorePath = path.join(path.resolve(source), ".gitignore");
  const gitignore = await System.fs.readFile(gitignorePath, "utf8");
  const lines = gitignore.split(/\r\n|\r|\n/);
  lines.forEach((line) => {
    if (!(line.startsWith("#") || line.trim().length == 0)) {
      ignores.push(line);
    }
  });
  ig.add(ignores);
  return traverse(source);
}
