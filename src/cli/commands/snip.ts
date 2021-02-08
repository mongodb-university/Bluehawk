import * as path from "path";
import { CommandModule, Arguments, Argv } from "yargs";
import {
  parseAndProcessProject,
  ParseResult,
  Project,
  getBluehawk,
} from "../../bluehawk";
import {
  withDestinationOption,
  withPluginOption,
  withStateOption,
  withIgnoreOption,
} from "../options";
import { System } from "../../bluehawk/System";

interface SnipArgs {
  paths: string[];
  destination: string;
  plugin?: string | string[];
  state?: string;
  ignore?: string | string[];
}

const handler = async ({
  paths,
  destination,
  plugin,
  state,
  ignore,
}: Arguments<SnipArgs>): Promise<void> => {
  const bluehawk = await getBluehawk(plugin);

  // If a file contains the state command, the processor will generate multiple
  // versions of the same file. Keep track of whether a state file was written
  // for the desired state name. We can also use this to diagnose possible typos
  // in params.state.
  const stateVersionWrittenForPath: {
    [path: string]: boolean;
  } = {};

  // Define the handler for generating snippet files.
  bluehawk.subscribe(async (result: ParseResult) => {
    const { source } = result;
    if (source.attributes["snippet"] === undefined) {
      return;
    }
    const targetPath = path.join(destination, source.basename);

    // Special handler for snippets in state commands
    if (state !== undefined) {
      const stateAttribute = source.attributes["state"];
      if (stateAttribute && stateAttribute !== state) {
        // Not the requested state
        return;
      }
      const stateVersionWritten = stateVersionWrittenForPath[source.path];
      if (stateVersionWritten === true) {
        // Already wrote state version, so nothing more to do. This prevents a
        // non-state version from overwriting the desired state version.
        return;
      }
      if (stateAttribute === state) {
        stateVersionWrittenForPath[source.path] = true;
      }
    }
    try {
      await System.fs.writeFile(targetPath, source.text.toString(), "utf8");
    } catch (error) {
      console.error(
        `Failed to write ${targetPath} (based on ${source.path}): ${error.message}`
      );
    }
  });

  // Run through all given source paths and process them.
  const promises = paths.map(async (rootPath) => {
    const project: Project = {
      rootPath,
      ignore,
    };
    return parseAndProcessProject(project, bluehawk);
  });

  await Promise.all(promises);

  if (state && Object.keys(stateVersionWrittenForPath).length === 0) {
    console.warn(
      `Warning: state '${state}' never found in ${paths.join(", ")}`
    );
  }
};

const commandModule: CommandModule<{ paths: string[] }, SnipArgs> = {
  command: "snip <paths..>",
  builder: (yargs): Argv<SnipArgs> => {
    return withIgnoreOption(
      withPluginOption(withStateOption(withDestinationOption(yargs)))
    );
  },
  handler,
  aliases: [],
  describe: "extract snippets",
};

export default commandModule;
