import { WithActionReporter } from "./ActionReporter";
import { getBluehawk } from "../../bluehawk";
import { BluehawkError } from "../../bluehawk/BluehawkError";
import { ActionArgs } from "./ActionArgs";
import { printJsonResult } from "./printJsonResult";

export interface CheckArgs extends ActionArgs {
  paths: string[];
  ignore?: string | string[];
  json?: boolean;
}

export interface CheckResult {}

export const check = async (
  args: WithActionReporter<CheckArgs>
): Promise<void> => {
  const { ignore, json, paths, waitForListeners, reporter } = args;
  const bluehawk = await getBluehawk();
  const fileToErrorMap = new Map<string, BluehawkError[]>();

  const addErrors = (filePath: string, errors: BluehawkError[]) => {
    reporter.onBluehawkErrors({
      errors,
      inputPath: filePath,
    });
    const existingErrors = fileToErrorMap.get(filePath) ?? [];
    fileToErrorMap.set(filePath, [...existingErrors, ...errors]);
  };

  // Define the handler for generating snippet files.
  bluehawk.subscribe(({ parseResult }) => {
    const { errors, input } = parseResult;
    if (errors.length !== 0) {
      addErrors(input.path, errors);
    }
  });

  // Run through all given input paths and process them.
  await bluehawk.parseAndProcess(paths, {
    ignore,
    onErrors: addErrors,
    waitForListeners: waitForListeners ?? false,
    reporter,
  });

  if (json) {
    const errorsByPath = Object.fromEntries(Array.from(fileToErrorMap));
    printJsonResult(args, errorsByPath);
  }
};
