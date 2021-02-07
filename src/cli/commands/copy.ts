import * as fs from "fs";
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

interface CopyArgs {
  rootPath: string;
  destination: string;
  plugin?: string | string[];
  state?: string;
  ignore?: string | string[];
}

const handler = async (args: Arguments<CopyArgs>): Promise<void> => {
  const { destination, ignore, plugin, rootPath } = args;
  const bluehawk = await getBluehawk(plugin);
  const projectDirectory = !fs.lstatSync(rootPath).isDirectory()
    ? path.dirname(rootPath)
    : rootPath;
  const desiredState = args.state;

  const onBinaryFile = (filePath: string) => {
    // Copy binary files directly
    const directory = path.join(
      destination,
      path.relative(projectDirectory, path.dirname(filePath))
    );
    const targetPath = path.join(directory, path.basename(filePath));
    fs.mkdir(directory, { recursive: true }, (error) => {
      if (error) {
        throw error;
      }
      fs.copyFile(filePath, targetPath, (error) => {
        if (error) {
          throw error;
        }
      });
    });
  };

  // If a file contains the state command, the processor will generate multiple
  // versions of the same file. Keep track of whether a state file was written
  // for the desired state name. We can also use this to diagnose possible typos
  // in params.state.
  const stateVersionWrittenForPath: {
    [path: string]: boolean;
  } = {};

  bluehawk.subscribe((result: ParseResult) => {
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

    return new Promise((resolve, reject) => {
      // Use the same relative path
      const directory = path.join(
        destination,
        path.relative(projectDirectory, path.dirname(source.path))
      );
      const targetPath = path.join(directory, source.basename);
      fs.mkdir(directory, { recursive: true }, (error) => {
        if (error) {
          return reject(error);
        }
        fs.writeFile(targetPath, source.text.toString(), "utf8", (error) => {
          if (error) {
            return reject(error);
          }
          resolve();
        });
      });
    });
  });

  const project: Project = {
    rootPath,
    ignore,
  };
  await parseAndProcessProject(project, bluehawk, onBinaryFile);

  if (desiredState && Object.keys(stateVersionWrittenForPath).length === 0) {
    console.warn(
      `Warning: state '${desiredState}' never found in ${projectDirectory}`
    );
  }
};

const commandModule: CommandModule<{ rootPath: string }, CopyArgs> = {
  command: "copy <rootPath>",
  builder: (yargs): Argv<CopyArgs> => {
    return withIgnoreOption(
      withPluginOption(withStateOption(withDestinationOption(yargs)))
    );
  },
  handler,
  aliases: [],
  describe:
    "clone source project to destination with Bluehawk commands processed",
};

export default commandModule;
