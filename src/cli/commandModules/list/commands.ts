import { CommandModule } from "yargs";
import { ActionArgs, ListCommandArgs, listCommands, withJsonOption } from "../../..";

const commandModule: CommandModule<ActionArgs, ListCommandArgs> = {
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
