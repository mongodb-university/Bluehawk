import { CommandModule, Arguments } from "yargs";
import { withIgnoreOption, withJsonOption } from "../options";
import { ActionArgs, CheckArgs, check } from "../../bluehawk";

const commandModule: CommandModule<
  ActionArgs & { paths: string[] },
  CheckArgs
> = {
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
