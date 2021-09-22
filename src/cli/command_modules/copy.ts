import { Stats } from "fs";
import * as path from "path";
import { CommandModule, Arguments, Argv } from "yargs";
import { getBluehawk } from "../../bluehawk";
import { MainArgs } from "../cli";
import {
  withDestinationOption,
  withStateOption,
  withIgnoreOption,
} from "../options";
import { System } from "../../bluehawk/io/System";
import { logErrorsToConsole } from "../../bluehawk/OnErrorFunction";
import { CopyArgs, copy } from "../actions";

const commandModule: CommandModule<MainArgs & { rootPath: string }, CopyArgs> =
  {
    command: "copy <rootPath>",
    builder: (yargs): Argv<CopyArgs> => {
      return withIgnoreOption(withStateOption(withDestinationOption(yargs)));
    },
    handler: async (args: Arguments<CopyArgs>) => {
      const errors = await copy(args);
      if (errors.length !== 0) {
        console.error(
          `Exiting with ${errors.length} error${
            errors.length === 1 ? "" : "s"
          }.`
        );
        process.exit(1);
      }
    },
    aliases: [],
    describe:
      "clone source project to destination with Bluehawk commands processed",
  };

export default commandModule;
