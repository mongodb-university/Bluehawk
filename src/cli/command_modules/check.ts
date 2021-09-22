import { CommandModule, Arguments } from "yargs";
import { withIgnoreOption, withJsonOption } from "../options";
import { MainArgs } from "../cli";
import { CheckArgs, check } from "../../bluehawk";

const commandModule: CommandModule<MainArgs & { paths: string[] }, CheckArgs> =
  {
    command: "check <paths..>",
    builder(yargs) {
      return withJsonOption(withIgnoreOption(yargs));
    },
    async handler(args) {
      return await check(args);
    },
    aliases: [],
    describe:
      "validate bluehawk markup without outputting any files. Exits with non-zero code if errors are found.",
  };

export default commandModule;
