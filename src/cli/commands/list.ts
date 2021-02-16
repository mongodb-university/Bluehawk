import * as yargs from "yargs";
import { commandDir } from "../cli";
import * as path from "path";

const commandModule: yargs.CommandModule = {
  command: "list",
  builder(yargs) {
    return commandDir(yargs, path.join("commands", "list"));
  },
  handler() {
    yargs.showHelp();
  },
  aliases: [],
  describe: "list info",
};

export default commandModule;
