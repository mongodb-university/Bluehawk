import { ConsoleActionReporter } from "./../../bluehawk/actions/ConsoleActionReporter";
import { CommandModule, Arguments, Argv } from "yargs";
import {
  withDestinationOption,
  withStateOption,
  withIdOption,
  withIgnoreOption,
  withGenerateFormattedCodeSnippetsOption,
} from "../../bluehawk/options";
import { ActionArgs, SnipArgs, snip } from "../../bluehawk";

const commandModule: CommandModule<ActionArgs & { paths: string[] }, SnipArgs> =
  {
    command: "snip <paths..>",
    builder: (yargs): Argv<SnipArgs> => {
      return withIgnoreOption(
        withStateOption(
          withIdOption(
            withDestinationOption(
              withGenerateFormattedCodeSnippetsOption(yargs)
            )
          )
        )
      );
    },
    handler: async (args: Arguments<SnipArgs>) => {
      const reporter = new ConsoleActionReporter();
      await snip({ ...args, reporter });
      reporter.summary();
      process.exit(reporter.errorCount > 0 ? 1 : 0);
    },
    aliases: [],
    describe: "extract snippets",
  };

export default commandModule;
