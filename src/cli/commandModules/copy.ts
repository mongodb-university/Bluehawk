import { ConsoleActionReporter } from "./../../bluehawk/actions/ConsoleActionReporter";
import { CommandModule, Arguments, Argv } from "yargs";
import {
  withOutputOption,
  withStateOption,
  withIgnoreOption,
  withLogLevelOption,
  ActionArgs,
  CopyArgs,
  copy,
} from "../..";

const commandModule: CommandModule<
  ActionArgs & { rootPath: string },
  CopyArgs
> = {
  command: "copy <rootPath>",
  builder: (yargs): Argv<CopyArgs> => {
    return withLogLevelOption(
      withIgnoreOption(withStateOption(withOutputOption(yargs)))
    );
  },
  handler: async (args: Arguments<CopyArgs>) => {
    const reporter = new ConsoleActionReporter(args);

    // parse rename argument to record if specified
    if (typeof args.rename === "string") {
      try {
        args.rename = JSON.parse(args.rename) as Record<string, string>;
      } catch (SyntaxError) {
        throw "Unable to parse 'rename' argument. Ensure your 'rename' argument is valid JSON.";
      }
    }

    await copy({ ...args, reporter });
    reporter.printSummary();
    process.exit(reporter.errorCount > 0 ? 1 : 0);
  },
  aliases: [],
  describe:
    "clone source project to output directory with Bluehawk commands processed",
};

export default commandModule;
