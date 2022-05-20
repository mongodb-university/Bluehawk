import { CommandModule } from "yargs";
import { ActionArgs, ListTagArgs, listTags, withJsonOption } from "../../..";

const commandModule: CommandModule<ActionArgs, ListTagArgs> = {
  command: "tags",
  builder(args) {
    return withJsonOption(args);
  },
  handler: async (args) => {
    await listTags(args);
  },
  aliases: [],
  describe: "list available tags",
};

export default commandModule;
