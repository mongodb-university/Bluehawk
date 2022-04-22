import { ConsoleActionReporter } from "./../../bluehawk/actions/ConsoleActionReporter";
import { CommandModule } from "yargs";
import {
  withIgnoreOption,
  withJsonOption,
  withLogLevelOption,
  ActionArgs,
  CheckArgs,
  check,
} from "../..";

const commandModule: CommandModule<
  ActionArgs & { paths: string[] },
  CheckArgs
> = {
  command: "check <paths..>",
  builder(yargs) {
    return withLogLevelOption(withJsonOption(withIgnoreOption(yargs)));
  },
  async handler(args) {
    const reporter = new ConsoleActionReporter(args);
    await check({ ...args, reporter });
    reporter.printSummary();
    process.exit(reporter.errorCount > 0 ? 1 : 0);
  },
  aliases: [],
  describe:
    "validate bluehawk markup without outputting any files. Exits with non-zero code if errors are found.",
};

export default commandModule;
