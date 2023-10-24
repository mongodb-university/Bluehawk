// usage: bluehawk exec path/to/config.[js|ts|json]
import { promises as fsp } from "fs";
import * as Path from "path";
import YAML from "yaml";

console.log("> in Config");

export interface BluehawkConfig {
  // action: "snip" | "copy" | "check";
  input: string;
  output: string;
  baseUri?: string;
  // ignore?: string[];
  // state?: string;
  format?: "rst" | "md" | "docusaurus"; // or arbitrary string perhaps?
}

const currentWorkingDirectory = Path.resolve(process.cwd());

// Traverse up to find "bluehawk.config.yaml"
const configFileName = "bluehawk.config.yaml";

export const getUserConfig = async (
  directory = currentWorkingDirectory
): Promise<BluehawkConfig> => {
  console.log(">> In find()");
  let ls = await fsp.readdir(directory);

  if (ls.includes(configFileName)) {
    const configFilePath = Path.join(directory, configFileName);
    console.log(">> Found config file: ", configFilePath);

    const configFile = await fsp.readFile(configFilePath, "utf-8");
    const parsedConfigFile: BluehawkConfig = YAML.parse(configFile);

    return parsedConfigFile;
  } else if (directory == "/") {
    throw new Error(`Couldn't find ${configFileName}`);
  } else {
    console.log(
      ">> Looking in next directory: ",
      Path.resolve(directory, "..")
    );
    return getUserConfig(Path.resolve(directory, ".."));
  }
};

// export const find = findConfig();

// export const config = getConfig();

// async function getConfig(): Promise<BluehawkConfig> {
//   console.log(__dirname);
//   const rawConfig = await fsp.readFile("bluehawk.config.yaml", "utf-8");
//   const config = YAML.parse(rawConfig);

//   console.log(config);

//   // @ts-ignore
//   return getConfig;
// }
