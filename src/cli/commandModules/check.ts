import { ConsoleActionReporter } from "./../../bluehawk/actions/ConsoleActionReporter";
import { CommandModule } from "yargs";
import {
  withIgnoreOption,
  withJsonOption,
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
    return withJsonOption(withIgnoreOption(yargs));
  },
  async handler(args) {
    const reporter = new ConsoleActionReporter();
    await check({ ...args, reporter });
    reporter.summary();
    process.exit(reporter.errorCount > 0 ? 1 : 0);
  },
  aliases: [],
  describe:
    "validate bluehawk markup without outputting any files. Exits with non-zero code if errors are found.",
};

export default commandModule;
