import * as path from "path";
import { CommandModule, Arguments, Argv } from "yargs";
import {
  parseAndProcessProject,
  ParseResult,
  Project,
  getBluehawk,
} from "../../bluehawk";
import { withIgnoreOption, withJsonOption } from "../options";
import { System } from "../../bluehawk/io/System";
import { MainArgs } from "../cli";
import { BluehawkError } from "../../bluehawk/BluehawkError";
import { printJsonResult } from "../printJsonResult";

interface CheckArgs extends MainArgs {
  paths: string[];
  ignore?: string | string[];
}

export const check = async (args: Arguments<CheckArgs>): Promise<void> => {
  const { ignore, json, paths, plugin } = args;
  const bluehawk = await getBluehawk(plugin);
  const errors: BluehawkError[] = [];

  // Define the handler for generating snippet files.
  bluehawk.subscribe(({ errors }) => {
    errors.push(...errors);
  });

  // Run through all given source paths and process them.
  const promises = paths.map(async (rootPath) => {
    const project: Project = {
      rootPath,
      ignore,
    };
    return parseAndProcessProject(project, bluehawk);
  });

  await Promise.all(promises);

  if (json) {
    printJsonResult(args, { errors });
  }

  // Errors already reported to console
  process.exit(errors.length === 0 ? 0 : 1);
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
