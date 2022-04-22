import { ConsoleActionReporter } from "./../../../bluehawk/actions/ConsoleActionReporter";
import { CommandModule } from "yargs";
import { withIgnoreOption, withJsonOption } from "../../../bluehawk/options";
import { ActionArgs, ListStatesArgs, listStates } from "../../../bluehawk";

const commandModule: CommandModule<
  ActionArgs & { paths: string[] },
  ListStatesArgs
> = {
  command: "states <paths..>",
  builder(argv) {
    return withJsonOption(withIgnoreOption(argv));
  },
  async handler(args) {
    const reporter = new ConsoleActionReporter();
    await listStates({ ...args, reporter });
    reporter.printSummary();
    process.exit(reporter.errorCount > 0 ? 1 : 0);
  },
  aliases: [],
  describe: "list states used in the given project",
};

export default commandModule;
