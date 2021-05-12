import * as path from "path";
import ignore from "ignore";
import { Project } from "./Project";
import { System } from "../io/System";

async function traverse(
  absolutePath: string,
  projectRoot: string,
  ignores: string[]
): Promise<string[]> {
  const ig = ignore();
  ig.add(ignores);
  const stats = await System.fs.lstat(absolutePath);
  const relativePath = path.relative(projectRoot, absolutePath);
  if (stats.isFile()) {
    // files nested at least one level within a project directory
    if (relativePath !== "") {
      if (ig.ignores(relativePath)) {
        return [];
      } else {
        return [absolutePath];
      }
    }
    // special handling -- when run on individual files, bluehawk path already contains file name
    return [absolutePath];
  }
  if (!stats.isDirectory()) {
    return [];
  }

  try {
    const gitignore = await System.fs.readFile(
      path.join(absolutePath, ".gitignore"),
      "utf8"
    );
    const gitignores = gitignore
      .split(/\r\n|\r|\n/)
      .filter((line) => !(line.startsWith("#") || line.trim().length == 0));
    ignores.push(...gitignores);
    ig.add(ignores);
  } catch {
    // no gitignore -- oh well
  }
  const files = await System.fs.readdir(absolutePath);
  const promises = files.map(
    async (file): Promise<string[]> => {
      const absoluteSubpath = path.join(absolutePath, file);
      const relativeSubpath = path.relative(projectRoot, absoluteSubpath);
      if (ig.ignores(relativeSubpath)) {
        return [];
      }
      return await traverse(absoluteSubpath, projectRoot, [...ignores]);
    }
  );
  return (await Promise.all(promises)).flat();
}

// Given a source entry point path, load all paths to files within, mindful of
// .gitignore.
export async function loadProjectPaths(project: Project): Promise<string[]> {
  const projectRoot = path.resolve(project.rootPath);
  const ignores = Array.isArray(project.ignore)
    ? project.ignore
    : typeof project.ignore === "string"
    ? [project.ignore]
    : [];

  return traverse(projectRoot, projectRoot, ignores);
}
