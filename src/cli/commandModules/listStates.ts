import { CommandModule } from "yargs";
import { withIgnoreOption, withJsonOption } from "../options";
import { ActionArgs, ListStatesArgs, listStates } from "../../bluehawk";

const commandModule: CommandModule<
  ActionArgs & { paths: string[] },
  ListStatesArgs
> = {
  command: "states <paths..>",
  builder(argv) {
    return withJsonOption(withIgnoreOption(argv));
  },
  async handler(args) {
    return await listStates(args);
  },
  aliases: [],
  describe: "list states used in the given project",
};

export default commandModule;
