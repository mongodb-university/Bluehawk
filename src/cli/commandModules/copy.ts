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
  CopyArgsCLI,
  copy,
} from "../..";

const commandModule: CommandModule<
  ActionArgs & { rootPath: string },
  CopyArgsCLI
> = {
  command: "copy <rootPath>",
  builder: (yargs): Argv<CopyArgsCLI> => {
    return withLogLevelOption(
      withIgnoreOption(
        withStateOption(withRenameOption(withOutputOption(yargs)))
      )
    );
  },
  handler: async (args: Arguments<CopyArgsCLI>) => {
    const reporter = new ConsoleActionReporter(args);
    let parsed_rename = undefined;
    // parse rename argument to record if specified
    if (typeof args.rename === "string") {
      try {
        parsed_rename = JSON.parse(args.rename) as Record<string, string>;
      } catch (SyntaxError) {
        throw "Unable to parse 'rename' argument. Ensure your 'rename' argument is valid JSON.";
      }
    }
    let args_parsed: CopyArgs = { ...args, rename: parsed_rename };
    await copy({ ...args_parsed, reporter });
    reporter.printSummary();
    process.exit(reporter.errorCount > 0 ? 1 : 0);
  },
  aliases: [],
  describe:
    "clone source project to output directory with Bluehawk commands processed",
};

export default commandModule;
