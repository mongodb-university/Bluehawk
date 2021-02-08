import * as path from "path";
import ignore from "ignore";
import { Project } from "./Project";
import { System } from "../System";

// Given a source entry point path, load all paths to files within, mindful of
// .gitignore.
export async function loadProjectPaths(project: Project): Promise<string[]> {
  const projectRoot = path.resolve(project.rootPath);
  const ig = ignore();
  const ignores = Array.isArray(project.ignore)
    ? project.ignore
    : typeof project.ignore === "string"
    ? [project.ignore]
    : [];

  async function traverse(absolutePath: string): Promise<string[]> {
    const stats = await System.fs.lstat(absolutePath);
    if (stats.isFile()) {
      return [path.relative(process.cwd(), absolutePath)];
    }
    if (!stats.isDirectory()) {
      return [];
    }
    const files = await System.fs.readdir(absolutePath);
    const promises = files.map(
      async (file): Promise<string[]> => {
        const absoluteSubpath = path.join(absolutePath, file);
        if (ig.ignores(path.relative(projectRoot, absoluteSubpath))) {
          return [];
        }
        return await traverse(absoluteSubpath);
      }
    );
    return (await Promise.all(promises)).flat();
  }

  try {
    // TODO: Recursively grab gitignore from each directory if it exists
    const gitignorePath = path.join(projectRoot, ".gitignore");
    const gitignore = await System.fs.readFile(gitignorePath, "utf8");
    const lines = gitignore.split(/\r\n|\r|\n/);
    lines.forEach((line) => {
      if (!(line.startsWith("#") || line.trim().length == 0)) {
        ignores.push(line);
      }
    });
    ig.add(ignores);
  } catch {
    // no gitignore -- oh well
  }
  return traverse(projectRoot);
}
