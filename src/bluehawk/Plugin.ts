import * as Path from "path";
import yargs, { Argv } from "yargs";
import { Bluehawk } from "./bluehawk";

/**
  A plugin is a Node module that exports a register() function.

  A plugin can be a simple JS file or a transpiled Node module, as long as it
  exports the register() function:

  ```js
    // MyPlugin.js
    exports.register = (args) => {
      // Add a new CLI option
      args.yargs.option("myNewOption", { string: true });

      // Add Bluehawk listener
      args.bluehawk.subscribe((result) => {
        console.log("Plugin called for file", result.document.path);
      });
    };
  ```

  You can then call `bluehawk --plugin /path/to/MyPlugin.js` to use the plugin.
 */
export type Plugin = {
  /**
    The CLI calls this function to allow the plugin to modify the main
    [[Bluehawk]] instance or the CLI itself.
   */
  register(args: PluginArgs): Promise<void> | void;
};

export type LoadedPlugin = Plugin & {
  /**
    The path to the plugin as provided to the CLI by the --plugin option.
   */
  path: string;
};

/**
  The arguments passed from the CLI to a plugin's register() function.
 */
export interface PluginArgs {
  /**
    The [[Bluehawk]] instance that a plugin can use to add Bluehawk commands,
    languages, and listeners.
  */
  bluehawk: Bluehawk;

  /**
    The [yargs](https://yargs.js.org/) instance that a plugin can modify to add
    CLI commands and options.
   */
  yargs: Argv;

  /**
    The current semantic version string of Bluehawk.
   */
  bluehawkVersion: string;

  /**
    The current semantic version string of Yargs.
   */
  yargsVersion: string;
}

/**
  Load the given plugin(s).
 */
export const loadPlugins = async (
  path: string | string[] | undefined
): Promise<LoadedPlugin[]> => {
  if (path === undefined) {
    return [];
  }

  if (Array.isArray(path)) {
    const plugins = await Promise.all(path.map((path) => loadPlugins(path)));
    return plugins.flat();
  }

  // Convert potentially relative path (from user's cwd) to absolute path -- as
  // import() expects relative paths from Bluehawk bin directory
  const absolutePath = Path.resolve(path);
  const { register } = await import(absolutePath);

  if (typeof register !== "function") {
    throw new Error(
      `loading plugin '${path}': expected function register(args) to be exported`
    );
  }

  return [
    {
      path,
      register,
    },
  ];
};

/**
  Loads a directory as yargs commands while supporting TypeScript for development.
  See yargs.commandDir().
 */
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
