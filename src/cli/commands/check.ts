import * as path from "path";
import { CommandModule, Arguments, Argv } from "yargs";
import {
  parseAndProcessProject,
  ParseResult,
  Project,
  getBluehawk,
} from "../../bluehawk";
import { withIgnoreOption, withJsonOption } from "../options";
import { MainArgs } from "../cli";
import { BluehawkError } from "../../bluehawk/BluehawkError";
import { printJsonResult } from "../printJsonResult";
import { logErrorsToConsole } from "../../bluehawk/OnErrorFunction";

interface CheckArgs extends MainArgs {
  paths: string[];
  ignore?: string | string[];
}

export const check = async (args: Arguments<CheckArgs>): Promise<void> => {
  const { ignore, json, paths, plugin } = args;
  const bluehawk = await getBluehawk(plugin);
  const fileToErrorMap = new Map<string, BluehawkError[]>();

  const addErrors = (filePath: string, errors: BluehawkError[]) => {
    logErrorsToConsole(filePath, errors);
    const existingErrors = fileToErrorMap.get(filePath) ?? [];
    fileToErrorMap.set(filePath, [...existingErrors, ...errors]);
  };

  // Define the handler for generating snippet files.
  bluehawk.subscribe(({ source, errors }) => {
    if (errors.length !== 0) {
      addErrors(source.path, errors);
    }
  });

  // Run through all given source paths and process them.
  const promises = paths.map(async (rootPath) => {
    const project: Project = {
      rootPath,
      ignore,
    };
    return parseAndProcessProject(project, bluehawk, undefined, addErrors);
  });

  await Promise.all(promises);

  if (json) {
    const errorsByPath = Object.fromEntries(Array.from(fileToErrorMap));
    printJsonResult(args, errorsByPath);
  }

  process.exit(fileToErrorMap.size);
};

const commandModule: CommandModule<
  MainArgs & { paths: string[] },
  CheckArgs
> = {
  command: "check <paths..>",
  builder(yargs) {
    return withJsonOption(withIgnoreOption(yargs));
  },
  async handler(args) {
    return await check(args);
  },
  aliases: [],
  describe:
    "validate bluehawk markup without outputting any files. Exits with non-zero code if errors are found.",
};

export default commandModule;
