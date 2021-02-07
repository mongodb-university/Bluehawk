import { loadProjectPaths } from "../bluehawk/loadProjectPaths";
import { Project } from "../bluehawk/Project";

export async function forEachPathInProject(
  project: Project,
  callback: (filePath: string) => void | Promise<void>
) {
  const files = await loadProjectPaths(project);
  const promises = files.map(callback);
  await Promise.all(promises);
}
