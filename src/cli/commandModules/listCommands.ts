import { CommandModule } from "yargs";
import { withJsonOption } from "../options";
import { MainArgs, ListCommandArgs, listCommands } from "../../bluehawk";

const commandModule: CommandModule<MainArgs, ListCommandArgs> = {
  command: "commands",
  builder(args) {
    return withJsonOption(args);
  },
  handler: async (args) => {
    await listCommands(args);
  },
  aliases: [],
  describe: "list available commands",
};

export default commandModule;
