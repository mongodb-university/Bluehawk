import * as yargs from "yargs";
import { withPluginOption } from "./options";

export interface MainArgs {
  plugin?: string | string[];
}

export function commandDir<T>(
  argv: yargs.Argv<T>,
  directory: string,
  options?: yargs.RequireDirectoryOptions
): yargs.Argv<T> {
  // Centralize the workaround for commandDir with TS
  return argv.commandDir(directory, {
    extensions: process.env.NODE_ENV === "development" ? ["js", "ts"] : ["js"],
    exclude: /\.test\.[jt]s$/,
    visit(commandModule) {
      return commandModule.default;
    },
    ...options,
  });
}

export async function run(): Promise<void> {
  commandDir(withPluginOption(yargs.help()), "commands").demandCommand().argv;
}
