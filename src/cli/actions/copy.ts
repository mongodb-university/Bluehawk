import { Stats } from "fs";
import * as path from "path";
import { getBluehawk } from "../../bluehawk";
import { MainArgs } from "../cli";
import { System } from "../../bluehawk/io/System";
import { logErrorsToConsole } from "../../bluehawk/OnErrorFunction";

export interface CopyArgs extends MainArgs {
  rootPath: string;
  destination: string;
  state?: string;
  ignore?: string | string[];

  /**
    Hook for additional work after a binary file is processed.
   */
  onBinaryFile?(path: string): Promise<void> | void;
}

export const copy = async (args: CopyArgs): Promise<string[]> => {
  const { destination, ignore, rootPath, waitForListeners } = args;
  const desiredState = args.state;
  const errors: string[] = [];
  const bluehawk = await getBluehawk();
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
      await copyPermissions({ to: targetPath, from: filePath });
    } catch (error) {
      const message = `Failed to copy file ${filePath} to ${targetPath}: ${error.message}`;
      console.error(message);
      errors.push(message);
    } finally {
      const { onBinaryFile } = args;
      onBinaryFile && (await onBinaryFile(filePath));
    }
  };

  // If a file contains the state command, the processor will generate multiple
  // versions of the same file. Keep track of whether a state file was written
  // for the desired state name. We can also use this to diagnose possible typos
  // in params.state.
  const stateVersionWrittenForPath: {
    [path: string]: boolean;
  } = {};

  bluehawk.subscribe(async (result) => {
    const { document, parseResult } = result;
    if (document.attributes.snippet) {
      // Not a pure state file
      return;
    }

    const { state } = document.attributes;

    if (state && state !== desiredState) {
      // This is a state file, but not the state we're looking for
      return;
    }

    const stateVersionWritten = stateVersionWrittenForPath[document.path];
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
      stateVersionWrittenForPath[document.path] = true;
    }

    // Use the same relative path
    const directory = path.join(
      destination,
      path.relative(projectDirectory, path.dirname(document.path))
    );
    const targetPath = path.join(directory, document.basename);

    try {
      await System.fs.mkdir(directory, { recursive: true });
      await System.fs.writeFile(targetPath, document.text.toString(), "utf8");
      await copyPermissions({
        to: targetPath,
        from: document.path,
      });
    } catch (error) {
      const message = `Failed to write file ${targetPath} (based on ${parseResult.source.path}): ${error.message}`;
      console.error(message);
      errors.push(message);
    }
  });

  await bluehawk.parseAndProcess(rootPath, {
    ignore,
    onBinaryFile,
    waitForListeners: waitForListeners ?? false,
    onErrors(filepath, newErrors) {
      logErrorsToConsole(filepath, newErrors);
      errors.push(...newErrors.map((e) => e.message));
    },
  });

  if (desiredState && Object.keys(stateVersionWrittenForPath).length === 0) {
    const message = `Warning: state '${desiredState}' never found in ${projectDirectory}`;
    console.warn(message);
    errors.push(message);
  }

  return errors;
};

/**
  Copy permissions (using stat/chmod) to the given path from the file at the
  given path.
 */
export const copyPermissions = async ({
  to,
  from,
}: {
  to: string;
  from: string;
}): Promise<void> => {
  const { mode } = await System.fs.stat(from);
  await System.fs.chmod(to, mode);
};
