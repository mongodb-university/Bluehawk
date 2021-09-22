import { Arguments } from "yargs";
import { getBluehawk } from "../../bluehawk";
import { BluehawkError } from "../../bluehawk/BluehawkError";
import { logErrorsToConsole } from "../../bluehawk/OnErrorFunction";
import { MainArgs } from "../../cli";
import { printJsonResult } from "./printJsonResult";

export interface CheckArgs extends MainArgs {
  paths: string[];
  ignore?: string | string[];
}

export const check = async (args: Arguments<CheckArgs>): Promise<void> => {
  const { ignore, json, paths, waitForListeners } = args;
  const bluehawk = await getBluehawk();
  const fileToErrorMap = new Map<string, BluehawkError[]>();

  const addErrors = (filePath: string, errors: BluehawkError[]) => {
    logErrorsToConsole(filePath, errors);
    const existingErrors = fileToErrorMap.get(filePath) ?? [];
    fileToErrorMap.set(filePath, [...existingErrors, ...errors]);
  };

  // Define the handler for generating snippet files.
  bluehawk.subscribe(({ parseResult }) => {
    const { errors, source } = parseResult;
    if (errors.length !== 0) {
      addErrors(source.path, errors);
    }
  });

  // Run through all given source paths and process them.
  await bluehawk.parseAndProcess(paths, {
    ignore,
    onErrors: addErrors,
    waitForListeners: waitForListeners ?? false,
  });

  if (json) {
    const errorsByPath = Object.fromEntries(Array.from(fileToErrorMap));
    printJsonResult(args, errorsByPath);
  }

  process.exit(fileToErrorMap.size);
};
