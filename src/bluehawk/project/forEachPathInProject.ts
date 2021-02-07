import { loadProjectPaths } from "./loadProjectPaths";
import { Project } from "./Project";

export async function forEachPathInProject(
  project: Project,
  callback: (filePath: string) => void | Promise<void>
): Promise<void> {
  const files = await loadProjectPaths(project);
  const promises = files.map(callback);
  await Promise.all(promises);
}
