import { isBinary } from "istextorbinary";
import { Bluehawk } from ".";
import { OnBinaryFileFunction } from "./OnBinaryFileFunction";

export async function parseAndProcess(
  bluehawk: Bluehawk,
  filePath: string,
  onBinaryFile?: OnBinaryFileFunction
): Promise<void> {
  try {
    if (isBinary(filePath)) {
      onBinaryFile && (await onBinaryFile(filePath));
      return;
    }
    const result = await bluehawk.loadFileAndParse(filePath);
    if (result.errors.length !== 0) {
      console.error(
        `Error in ${filePath}:\n${result.errors
          .map(
            (error) =>
              `  at line ${error.location.line} col ${error.location.column}: ${error.message}`
          )
          .join("\n")}`
      );
      return;
    }
    await bluehawk.process(result);
  } catch (e) {
    console.error(`Encountered the following error while processing ${filePath}:
${e.stack}

This is probably a bug in Bluehawk. Please send this stack trace (and the contents of ${filePath}, if possible) to the Bluehawk development team at https://github.com/mongodb-university/Bluehawk/issues/new`);
  }
}
