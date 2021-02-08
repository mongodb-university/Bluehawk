import { Stats } from "fs";
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
import { System } from "../System";

export interface CopyArgs {
  rootPath: string;
  destination: string;
  plugin?: string | string[];
  state?: string;
  ignore?: string | string[];
}

export const copy = async (args: CopyArgs): Promise<string[]> => {
  const { destination, ignore, plugin, rootPath } = args;
  const desiredState = args.state;
  const errors: string[] = [];
  const bluehawk = await getBluehawk(plugin);
  let stats: Stats;
  try {
    stats = await System.fs.lstat(rootPath);
  } catch (error) {
    const message = `Could not load stats for ${rootPath}: ${error.message}`;
    console.error(message);
    errors.push(message);
    return errors;
  }
  const projectDirectory = !stats.isDirectory()
    ? path.dirname(rootPath)
    : rootPath;

  const onBinaryFile = async (filePath: string) => {
    // Copy binary files directly
    const directory = path.join(
      destination,
      path.relative(projectDirectory, path.dirname(filePath))
    );
    const targetPath = path.join(directory, path.basename(filePath));
    try {
      await System.fs.mkdir(directory, { recursive: true });
      await System.fs.copyFile(filePath, targetPath);
    } catch (error) {
      const message = `Failed to copy file ${filePath} to ${targetPath}: ${error.message}`;
      console.error(message);
      errors.push(message);
    }
  };

  // If a file contains the state command, the processor will generate multiple
  // versions of the same file. Keep track of whether a state file was written
  // for the desired state name. We can also use this to diagnose possible typos
  // in params.state.
  const stateVersionWrittenForPath: {
    [path: string]: boolean;
  } = {};

  bluehawk.subscribe(async (result: ParseResult) => {
    const { source } = result;
    if (source.attributes.snippet) {
      // Not a pure state file
      return;
    }

    const { state } = source.attributes;

    if (state && state !== desiredState) {
      // This is a state file, but not the state we're looking for
      return;
    }

    const stateVersionWritten = stateVersionWrittenForPath[source.path];
    // Already wrote state version, so nothing more to do
    if (stateVersionWritten === true) {
      return;
    }

    // We will either write the state-processed version or the default
    // version. If a file we already saved is later found to have had state
    // commands in it, then the state version will overwrite it. However, we
    // will never overwrite a state command processed version with the default
    // version.
    if (state === desiredState) {
      stateVersionWrittenForPath[source.path] = true;
    }

    // Use the same relative path
    const directory = path.join(
      destination,
      path.relative(projectDirectory, path.dirname(source.path))
    );
    const targetPath = path.join(directory, source.basename);

    try {
      await System.fs.mkdir(directory, { recursive: true });
      await System.fs.writeFile(targetPath, source.text.toString(), "utf8");
    } catch (error) {
      const message = `Failed to write file ${targetPath} (based on ${source.path}): ${error.message}`;
      console.error(message);
      errors.push(message);
    }
  });

  const project: Project = {
    rootPath,
    ignore,
  };
  await parseAndProcessProject(project, bluehawk, onBinaryFile);

  if (desiredState && Object.keys(stateVersionWrittenForPath).length === 0) {
    const message = `Warning: state '${desiredState}' never found in ${projectDirectory}`;
    console.warn(message);
    errors.push(message);
  }

  return errors;
};

const commandModule: CommandModule<{ rootPath: string }, CopyArgs> = {
  command: "copy <rootPath>",
  builder: (yargs): Argv<CopyArgs> => {
    return withIgnoreOption(
      withPluginOption(withStateOption(withDestinationOption(yargs)))
    );
  },
  handler: async (args: Arguments<CopyArgs>) => await copy(args),
  aliases: [],
  describe:
    "clone source project to destination with Bluehawk commands processed",
};

export default commandModule;
