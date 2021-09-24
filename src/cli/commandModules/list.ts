import * as yargs from "yargs";

const commandModule: yargs.CommandModule = {
  command: "list",
  handler() {
    yargs.showHelp();
  },
  aliases: [],
  describe: "list info",
};

export default commandModule;
