import { CommandModule, Arguments, Argv } from "yargs";
import {
  withDestinationOption,
  withStateOption,
  withIgnoreOption,
} from "../options";
import { ActionArgs, CopyArgs, copy } from "../../bluehawk";

const commandModule: CommandModule<
  ActionArgs & { rootPath: string },
  CopyArgs
> = {
  command: "copy <rootPath>",
  builder: (yargs): Argv<CopyArgs> => {
    return withIgnoreOption(withStateOption(withDestinationOption(yargs)));
  },
  handler: async (args: Arguments<CopyArgs>) => {
    const errors = await copy(args);
    if (errors.length !== 0) {
      console.error(
        `Exiting with ${errors.length} error${errors.length === 1 ? "" : "s"}.`
      );
      process.exit(1);
    }
  },
  aliases: [],
  describe:
    "clone source project to destination with Bluehawk commands processed",
};

export default commandModule;
