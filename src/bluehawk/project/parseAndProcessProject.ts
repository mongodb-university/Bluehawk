import { Bluehawk } from "..";
import { Project } from "./Project";
import { OnBinaryFileFunction } from "../OnBinaryFileFunction";
import { parseAndProcess } from "../parseAndProcess";
import { forEachPathInProject } from "./forEachPathInProject";
import { OnErrorFunction } from "../OnErrorFunction";

export async function parseAndProcessProject(
  project: Project,
  bluehawk: Bluehawk,
  onBinaryFile?: OnBinaryFileFunction,
  onErrors?: OnErrorFunction
): Promise<void> {
  await forEachPathInProject(
    project,
    async (filePath) =>
      await parseAndProcess(project, bluehawk, filePath, onBinaryFile, onErrors)
  );
}
