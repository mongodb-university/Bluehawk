import { WithActionReporter } from "./ActionReporter";
import { loadProjectPaths, snip, check, copy } from "../../bluehawk";
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
}

export interface ConfigAction {
  command: "snip" | "copy" | "check";
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

    // Run config commands
    for (let index = 0; index < rootConfig.commands.length; index++) {
      const { command, source, destination, ignore, state, format, json } =
        rootConfig.commands[index];

      reporter.onActionProcessed({
        inputPath: rootConfigPath!,
        name: command,
      });

      switch (command) {
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
          await copy({
            reporter,
            output: destination,
            rootPath: source,
            waitForListeners: true,
          });

          break;

        default:
          console.error(new Error("No Bluehawk action found!"));

          break;
      }
    }

    await processSubconfigFiles();
  } else {
    console.error("No Bluehawk config commands found.");
  }

  // Look for and process config files in child directories
  async function processSubconfigFiles() {
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
      const gitignores = [
        "android",
        "ios",
        ".*",
        "*.lock",
        "gemfile",
        "*.config.*",
        "*.json",
        "*.cjs",
        "*.md",
      ];

      ignores.push(...gitignores);
    }

    const filePaths = await loadProjectPaths({
      rootPath: currentWorkingDirectory,
      ignore: ignores,
    });

    // Look for file paths that:
    // - include "bluhawk.config.yaml"
    // - do not include the current working directory + "bluhawk.config.yaml"
    // - the last bit of the file path equals "bluhawk.config.yaml"
    const subConfigFilePaths = filePaths.filter(
      (filePath) =>
        filePath.includes(configFileName) &&
        filePath != Path.join(currentWorkingDirectory, configFileName) &&
        filePath.split("/").pop() == configFileName
    );

    // Process each subconfig file
    for (let index = 0; index < subConfigFilePaths.length; index++) {
      const subConfig = await parseConfigFile(subConfigFilePaths[index]);
      const subConfigPath = subConfigFilePaths[index].substring(
        0,
        subConfigFilePaths[index].lastIndexOf(configFileName)
      );

      reporter.onFileParsed({
        inputPath: subConfigFilePaths[index],
        isConfig: true,
      });

      // Run config commands
      for (let index = 0; index < subConfig.commands.length; index++) {
        const { command, source, destination, ignore, state, format, json } =
          subConfig.commands[index];
        const sourceFilePath = source
          ? Path.join(subConfigPath, source)
          : subConfigPath;

        reporter.onActionProcessed({
          inputPath: sourceFilePath,
          name: command,
        });

        switch (command) {
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
            await copy({
              reporter,
              output: destination,
              rootPath: source,
              waitForListeners: true,
            });

            break;

          default:
            console.error(new Error("No action found!"));

            break;
        }
      }
    }
  }
};
