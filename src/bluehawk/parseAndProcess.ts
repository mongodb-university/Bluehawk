import { isBinary } from "istextorbinary";
import { Bluehawk } from ".";
import { OnBinaryFileFunction } from "./OnBinaryFileFunction";
import { OnErrorFunction, logErrorsToConsole } from "./OnErrorFunction";
import { Project } from "./project";
import * as path from "path";
import { System } from "./io/System";
import { Document } from "./Document";

export async function parseAndProcess(
  project: Project,
  bluehawk: Bluehawk,
  filePath: string,
  onBinaryFile?: OnBinaryFileFunction,
  onErrors: OnErrorFunction = logErrorsToConsole
): Promise<void> {
  try {
    const blob = await System.fs.readFile(path.resolve(filePath));
    if (isBinary(filePath, blob)) {
      onBinaryFile && (await onBinaryFile(filePath));
      return;
    }
    const language = path.extname(filePath);
    const text = blob.toString("utf8");
    const document = new Document({ text, language, path: filePath });
    const result = bluehawk.parse(document);
    if (result.errors.length !== 0) {
      return onErrors(filePath, result.errors);
    }
    await bluehawk.process(result);
  } catch (e) {
    console.error(`Encountered the following error while processing ${filePath}:
${e.stack}

This is probably a bug in Bluehawk. Please send this stack trace (and the contents of ${filePath}, if possible) to the Bluehawk development team at https://github.com/mongodb-university/Bluehawk/issues/new`);
  }
}
