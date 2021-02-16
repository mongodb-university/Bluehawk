import { isBinary } from "istextorbinary";
import { Bluehawk } from ".";
import { OnBinaryFileFunction } from "./OnBinaryFileFunction";
import { OnErrorFunction, logErrorsToConsole } from "./OnErrorFunction";
import { Project } from "./project";
import * as path from "path";

export async function parseAndProcess(
  project: Project,
  bluehawk: Bluehawk,
  filePath: string,
  onBinaryFile?: OnBinaryFileFunction,
  onErrors: OnErrorFunction = logErrorsToConsole
): Promise<void> {
  try {
    if (isBinary(filePath)) {
      onBinaryFile && (await onBinaryFile(filePath));
      return;
    }
    const document = await bluehawk.readFile(filePath);
    const result = bluehawk.parse(document);
    if (result.errors.length !== 0) {
      return onErrors(path.relative(project.rootPath, filePath), result.errors);
    }
    await bluehawk.process(result);
  } catch (e) {
    console.error(`Encountered the following error while processing ${filePath}:
${e.stack}

This is probably a bug in Bluehawk. Please send this stack trace (and the contents of ${filePath}, if possible) to the Bluehawk development team at https://github.com/mongodb-university/Bluehawk/issues/new`);
  }
}
