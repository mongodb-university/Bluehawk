import { ConsoleActionReporter } from "./../../bluehawk/actions/ConsoleActionReporter";
import { CommandModule, Arguments, Argv } from "yargs";
import {
  withOutputOption,
  withStateOption,
  withIgnoreOption,
  withLogLevelOption,
  withRenameOption,
  ActionArgs,
  CopyArgs,
  CopyArgsCli,
  copy,
} from "../..";

const commandModule: CommandModule<
  ActionArgs & { rootPath: string },
  CopyArgsCli
> = {
  command: "copy <rootPath>",
  builder: (yargs): Argv<CopyArgsCli> => {
    return withLogLevelOption(
      withIgnoreOption(
        withStateOption(withRenameOption(withOutputOption(yargs)))
      )
    );
  },
  handler: async (args: Arguments<CopyArgsCli>) => {
    const reporter = new ConsoleActionReporter(args);
    let parsedRename = undefined;
    // parse rename argument to record if specified
    if (typeof args.rename === "string") {
      try {
        parsedRename = JSON.parse(args.rename) as Record<string, string>;
      } catch (SyntaxError) {
        throw "Unable to parse 'rename' argument. Ensure your 'rename' argument is valid JSON.";
      }
    }
    const argsParsed: CopyArgs = { ...args, rename: parsedRename };
    await copy({ ...argsParsed, reporter });
    reporter.printSummary();
    process.exit(reporter.errorCount > 0 ? 1 : 0);
  },
  aliases: [],
  describe:
    "clone source project to output directory with Bluehawk commands processed",
};

export default commandModule;
