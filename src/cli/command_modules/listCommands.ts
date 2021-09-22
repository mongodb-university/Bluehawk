import { CommandModule } from "yargs";
import { MainArgs } from "../cli";
import { withJsonOption } from "../options";
import { listCommands } from "../actions";

const commandModule: CommandModule<MainArgs, MainArgs & { json?: boolean }> = {
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
