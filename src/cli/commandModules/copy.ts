import { ConsoleActionReporter } from "./../../bluehawk/actions/ConsoleActionReporter";
import { CommandModule, Arguments, Argv } from "yargs";
import {
  withDestinationOption,
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
      withIgnoreOption(withStateOption(withDestinationOption(yargs)))
    );
  },
  handler: async (args: Arguments<CopyArgs>) => {
    const reporter = new ConsoleActionReporter(args);
    await copy({ ...args, reporter });
    reporter.printSummary();
    process.exit(reporter.errorCount > 0 ? 1 : 0);
  },
  aliases: [],
  describe:
    "clone source project to destination with Bluehawk commands processed",
};

export default commandModule;
