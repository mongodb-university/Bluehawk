import { WithActionReporter } from "./ActionReporter";
import { Stats } from "fs";
import * as path from "path";
import { getBluehawk } from "../../bluehawk";
import { ActionArgs } from "./ActionArgs";
import { System } from "../../bluehawk/io/System";

export interface CopyArgs extends ActionArgs {
  rootPath: string;
  output: string;
  state?: string;
  ignore?: string | string[];

  /**
    Hook for additional work after a binary file is processed.
   */
  onBinaryFile?(path: string): Promise<void> | void;
}

export const copy = async (
  args: WithActionReporter<CopyArgs>
): Promise<void> => {
  const { output, ignore, rootPath, waitForListeners, reporter } = args;
  const desiredState = args.state;
  const bluehawk = await getBluehawk();
  let stats: Stats;
  try {
    stats = await System.fs.lstat(rootPath);
  } catch (error) {
    reporter.onFileError({
      error,
      inputPath: rootPath,
    });
    return;
  }
  const projectDirectory = !stats.isDirectory()
    ? path.dirname(rootPath)
    : rootPath;

  const onBinaryFile = async (filePath: string) => {
    // Copy binary files directly
    const directory = path.join(
      output,
      path.relative(projectDirectory, path.dirname(filePath))
    );
    const targetPath = path.join(directory, path.basename(filePath));
    try {
      await System.fs.mkdir(directory, { recursive: true });
      await System.fs.copyFile(filePath, targetPath);
      await copyPermissions({ to: targetPath, from: filePath });
      reporter.onFileWritten({
        type: "binary",
        inputPath: filePath,
        outputPath: targetPath,
      });
    } catch (error) {
      reporter.onWriteFailed({
        outputPath: targetPath,
        inputPath: filePath,
        error,
        type: "binary",
      });
    }
    args.onBinaryFile && args.onBinaryFile(filePath);
  };

  // If a file contains the state tag, the processor will generate multiple
  // versions of the same file. Keep track of whether a state file was written
  // for the desired state name. We can also use this to diagnose possible typos
  // in params.state.
  const stateVersionWrittenForPath: {
    [path: string]: boolean;
  } = {};

  bluehawk.subscribe(async (processResult) => {
    const { document, parseResult } = processResult;
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
    // tags in it, then the state version will overwrite it. However, we
    // will never overwrite a state tag processed version with the default
    // version.
    if (state === desiredState) {
      stateVersionWrittenForPath[document.path] = true;
    }

    // Use the same relative path
    const directory = path.join(
      output,
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
      reporter.onFileWritten({
        type: "text",
        inputPath: document.path,
        outputPath: targetPath,
      });
    } catch (error) {
      reporter.onWriteFailed({
        outputPath: targetPath,
        inputPath: parseResult.source.path,
        error,
        type: "text",
      });
    }
  });

  await bluehawk.parseAndProcess(rootPath, {
    ignore,
    onBinaryFile,
    waitForListeners: waitForListeners ?? false,
    onErrors(inputPath, errors) {
      reporter.onBluehawkErrors({
        errors,
        inputPath,
      });
    },
    reporter,
  });

  if (desiredState && Object.keys(stateVersionWrittenForPath).length === 0) {
    reporter.onStateNotFound({
      state: desiredState,
      paths: [projectDirectory],
    });
  }
};

/**
  Copy permissions (using stat/chmod) to the given path from the file at the
  given path.
 */
const copyPermissions = async ({
  to,
  from,
}: {
  to: string;
  from: string;
}): Promise<void> => {
  const { mode } = await System.fs.stat(from);
  await System.fs.chmod(to, mode);
};
