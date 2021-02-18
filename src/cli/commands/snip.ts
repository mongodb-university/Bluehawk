import * as path from "path";
import { CommandModule, Arguments, Argv, options } from "yargs";
import {
  parseAndProcessProject,
  ParseResult,
  Project,
  getBluehawk,
} from "../../bluehawk";
import {
  withDestinationOption,
  withStateOption,
  withIgnoreOption,
  withGenerateFormattedCodeSnippetsOption,
} from "../options";
import { System } from "../../bluehawk/io/System";
import { MainArgs } from "../cli";

interface SnipArgs extends MainArgs {
  paths: string[];
  destination: string;
  state?: string;
  ignore?: string | string[];
  generateFormattedCodeSnippets?: string;
}

export const snip = async (args: SnipArgs): Promise<void> => {
  const { paths, destination, plugin, state, ignore } = args;
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

  // Define the handler for generating formatted snippet files.
  bluehawk.subscribe(async (result: ParseResult) => {
    const { source } = result;
    if (
      source.attributes["snippet"] === undefined ||
      source.attributes["emphasize"] === undefined
    ) {
      return;
    }

    // TODO: need to make sure that "generate formatted snippets" is turned on here
    const targetPath = path.join(destination, source.basename);

    const rstHeader = ".. code-block:: ";
    const rstEmphasizeModifier = ":emphasize-lines: ";
    const range = source.attributes["emphasize"]["range"];

    const formattedCodeblock =
      rstHeader +
      source.language +
      "\n" +
      rstEmphasizeModifier +
      range +
      source.text.toString();

    console.log(formattedCodeblock);

    try {
      await System.fs.writeFile(targetPath, formattedCodeblock, "utf8");
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

const commandModule: CommandModule<MainArgs & { paths: string[] }, SnipArgs> = {
  command: "snip <paths..>",
  builder: (yargs): Argv<SnipArgs> => {
    return withIgnoreOption(
      withStateOption(
        withDestinationOption(withGenerateFormattedCodeSnippetsOption(yargs))
      )
    );
  },
  handler: async (args: Arguments<SnipArgs>) => await snip(args),
  aliases: [],
  describe: "extract snippets",
};

export default commandModule;
