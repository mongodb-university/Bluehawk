import { CommandModule } from "yargs";
import { ActionArgs, ListTagArgs, listTags, withJsonOption } from "../../..";

const commandModule: CommandModule<ActionArgs, ListTagArgs> = {
  command: "commands",
  builder(args) {
    return withJsonOption(args);
  },
  handler: async (args) => {
    await listTags(args);
  },
  aliases: [],
  describe: "list available commands",
};

export default commandModule;
