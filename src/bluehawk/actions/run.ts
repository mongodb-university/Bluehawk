import { WithActionReporter } from "./ActionReporter";
import {
  getBluehawk,
  loadProjectPaths,
  ConsoleActionReporter,
  snip,
  check,
  copy,
} from "../../bluehawk";
import { BluehawkError } from "../../bluehawk/BluehawkError";
import { ActionArgs } from "./ActionArgs";
import { promises as fsp } from "fs";
import { System } from "../io/System";
import * as Path from "path";
import YAML from "yaml";

export interface ConfigArgs extends ActionArgs {
  configPath?: string;
}

export interface Config {
  commands: ConfigAction[];
  // plugins?: ConfigPlugin[];
  baseUri?: string;
  subConfig?: boolean;
  logLevel?: string;
}

export interface ConfigPlugin {
  name: string;
}

export interface ConfigAction {
  action: "snip" | "copy" | "check";
  source: string;
  destination: string;
  ignore?: string[];
  state?: string;
  format?: "rst" | "md" | "docusaurus";
  json?: boolean;
}

export const run = async (
  args: WithActionReporter<ConfigArgs>
): Promise<void> => {
  const { configPath, reporter } = args;
  const currentWorkingDirectory = Path.resolve(process.cwd());
  const configFileName = "bluehawk.config.yaml";

  let rootConfig: Config | undefined = undefined;
  let rootConfigPath = configPath ? configPath : undefined;

  // Get and parse root config file
  const parseConfigFile = async (configFilePath: string) => {
    const configFile = await fsp.readFile(configFilePath, "utf-8");
    const parsedConfigFile: Config = YAML.parse(configFile);

    return parsedConfigFile;
  };

  // Look for "bluehawk.config.yaml" in current working directory. If not
  // there, traverse up the file path to system root.
  const getRootConfigFile = async (
    directory = currentWorkingDirectory
  ): Promise<Config> => {
    const ls = await fsp.readdir(directory);

    if (ls.includes(configFileName)) {
      const configFilePath = Path.join(directory, configFileName);
      rootConfigPath = configFilePath;

      return parseConfigFile(configFilePath);
    } else if (directory == "/") {
      throw new Error(`Couldn't find ${configFileName}`);
    } else {
      return getRootConfigFile(Path.resolve(directory, ".."));
    }
  };

  if (configPath) {
    rootConfig = await parseConfigFile(configPath[0]);
  } else {
    rootConfig = await getRootConfigFile();
  }

  // Process root config file
  if (rootConfig) {
    reporter.onFileParsed({
      inputPath: rootConfigPath!,
      isConfig: true,
    });

    // Run config actions
    for (let index = 0; index < rootConfig.commands.length; index++) {
      const { action, source, destination, ignore, state, format, json } =
        rootConfig.commands[index];

      reporter.onActionProcessed({
        inputPath: rootConfigPath!,
        name: action,
      });

      // TODO: If error in previous command, exit with results and error.
      // TODO: Bluehawk will currently look in all subdirectories with
      // loadProjectPaths. Even if there are subconfig files. Maybe this
      // is desirable?

      switch (action) {
        case "snip":
          await snip({
            paths: [source],
            output: destination,
            ignore: ignore,
            state: state,
            format: format,
            reporter,
            waitForListeners: true,
          });

          break;

        case "check":
          await check({
            paths: [source],
            ignore: ignore,
            json: json,
            reporter,
          });

          break;

        case "copy":
          // await copy({
          //   reporter,
          //   output: outputPath,
          //   rootPath,
          //   waitForListeners: true,
          // });

          break;

        default:
          console.error(new Error("No action found!"));

          break;
      }
    }
  } else {
    console.error("No config actions found.");
    // TODO: log error
  }

  if (rootConfig.subConfig) {
    const ignores: string[] = [".git"];

    try {
      const gitignore = await System.fs.readFile(
        Path.join(currentWorkingDirectory, ".gitignore"),
        "utf8"
      );
      const gitignores = gitignore
        .split(/\r\n|\r|\n/)
        .filter((line) => !(line.startsWith("#") || line.trim().length == 0));
      ignores.push(...gitignores);
    } catch {
      // no gitignore -- oh well
      // TODO: add some sensible default ignores? Like node_modules?
    }

    const filePaths = await loadProjectPaths({
      rootPath: currentWorkingDirectory,
      ignore: ignores,
    });

    const subConfigFilePaths = filePaths.filter(
      (filePath) =>
        filePath.includes(configFileName) &&
        filePath != Path.join(currentWorkingDirectory, configFileName) &&
        filePath.split("/").pop() == configFileName
    );

    for (let index = 0; index < subConfigFilePaths.length; index++) {
      const subConfig = await parseConfigFile(subConfigFilePaths[index]);
      const subConfigPath = subConfigFilePaths[index].substring(
        0,
        subConfigFilePaths[index].lastIndexOf(configFileName)
      );

      reporter.onFileParsed({
        inputPath: subConfigPath,
        isConfig: true,
      });

      for (let index = 0; index < subConfig.commands.length; index++) {
        const { action, source, destination, ignore, state, format, json } =
          subConfig.commands[index];
        const sourceFilePath = source
          ? Path.join(subConfigPath, source)
          : subConfigPath;

        reporter.onActionProcessed({
          inputPath: rootConfigPath!,
          name: action,
        });

        // TODO: If error in previous command, exit with results and error.

        switch (action) {
          case "snip":
            await snip({
              paths: [sourceFilePath],
              output: Path.join(subConfigPath, destination),
              ignore: ignore
                ? [...ignore, "bluehawk.config.yaml"]
                : ["bluehawk.config.yaml"],
              state: state,
              format: format,
              reporter,
            });

            break;

          case "check":
            await check({
              paths: [source],
              ignore: ignore,
              json: json,
              reporter,
            });

            break;

          case "copy":
            break;

          default:
            console.error(new Error("No action found!"));

            break;
        }
      }
    }
  }
};
