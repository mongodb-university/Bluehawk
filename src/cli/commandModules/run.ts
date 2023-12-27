// usage: bluehawk exec path/to/config.[js|ts|json]
import { ConsoleActionReporter } from "./../../bluehawk/actions/ConsoleActionReporter";
import { CommandModule } from "yargs";
import {
  ActionArgs,
  ConfigArgs,
  withLogLevelOption,
  withConfigOption,
  run,
} from "../../bluehawk";

const commandModule: CommandModule<ActionArgs & { path?: string }, ConfigArgs> =
  {
    command: ["run [path..]", "run"],
    builder(yargs) {
      return withLogLevelOption(withConfigOption(yargs));
    },
    async handler(args) {
      const reporter = new ConsoleActionReporter(args);

      await run({ ...args, reporter });
      reporter.printSummary();
      process.exit(reporter.errorCount > 0 ? 1 : 0);
    },
    aliases: [],
    describe: "Run Bluehawk actions based on a root configuration file.",
  };

export default commandModule;
