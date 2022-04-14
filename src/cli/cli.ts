import * as Path from "path";
import * as yargs from "yargs";
import { getBluehawk, loadPlugins, commandDir } from "../bluehawk";
import { version as yargsVersion } from "yargs/package.json";
import { version as bluehawkVersion } from "../../package.json";

export async function run(): Promise<void> {
  const preArgv = yargs.option("plugin", {
    string: true,
    describe: "add a plugin",
  }).argv;

  const mainArgv = commandDir(yargs.help(), Path.join(__dirname, "commandModules")).demandCommand();

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
