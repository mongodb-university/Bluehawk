import * as yargs from "yargs";
import { getBluehawk } from "../bluehawk";
import { loadPlugins } from "./Plugin";
import { version as yargsVersion } from "yargs/package.json";
import { version as bluehawkVersion } from "../../package.json";

export function commandDir<T>(
  argv: yargs.Argv<T>,
  directory: string,
  options?: yargs.RequireDirectoryOptions
): yargs.Argv<T> {
  // Centralize the workaround for commandDir with TS
  return argv.commandDir(directory, {
    extensions: process.env.NODE_ENV === "development" ? ["js", "ts"] : ["js"],
    exclude: /^(?:index|.*\.test)\.[jt]s$/,
    visit(commandModule) {
      return commandModule.default;
    },
    ...options,
  });
}

export async function run(): Promise<void> {
  const preArgv = yargs.option("plugin", {
    string: true,
    describe: "add a plugin",
  }).argv;

  const mainArgv = commandDir(yargs.help(), "command_modules").demandCommand();

  const plugins = await loadPlugins(preArgv.plugin);

  const bluehawk = await getBluehawk();

  const pluginPromises = plugins.map(async (plugin) => {
    const { path, register } = plugin;
    try {
      await register({
        bluehawk,
        bluehawkVersion,
        yargs: mainArgv,
        yargsVersion,
      });
    } catch (error) {
      error.message = `Plugin '${path}' register() failed with error: ${error.message}`;
      throw error;
    }
  });

  await Promise.all(pluginPromises);

  // Accessing this property executes CLI
  mainArgv.argv;
}
