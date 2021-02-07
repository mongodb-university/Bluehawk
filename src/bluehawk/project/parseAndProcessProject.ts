import { Bluehawk } from "..";
import { Project } from "./Project";
import { OnBinaryFileFunction } from "../OnBinaryFileFunction";
import { parseAndProcess } from "../parseAndProcess";
import { forEachPathInProject } from "./forEachPathInProject";

export async function parseAndProcessProject(
  project: Project,
  bluehawk: Bluehawk,
  onBinaryFile?: OnBinaryFileFunction
): Promise<void> {
  await forEachPathInProject(
    project,
    async (filePath) => await parseAndProcess(bluehawk, filePath, onBinaryFile)
  );
}
