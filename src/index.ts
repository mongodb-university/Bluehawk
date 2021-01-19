import * as yargs from "yargs";
import { MessageHandler } from "./io/messageHandler";
import * as bhp from "./io/parseSource";
import fs from "fs";
import path from "path";
import { ParseResult } from "./parser/ParseResult";
import { Listener } from "./processor/Processor";

const output = MessageHandler.getMessageHandler();

async function run(): Promise<void> {
  const params = yargs
    .usage("Usage: $0 <command> [options]")
    .command("--source", "The file or folder to process")
    .command("--destination", "The output folder")
    .command("--ignores", "A glob list of patterns to ignore")
    .command("--state", "Which state to render")
    .boolean("snippets")
    .describe("snippets", "Output snippet files only")
    .example(
      "$0 -s ./foo.js -d ./output/",
      "Parse the foo.js file and output results in the output/ directory."
    )
    .alias("s", "source")
    .alias("d", "destination")
    .alias("i", "ignores")
    .demandOption(["source"])
    .help("h")
    .alias("h", "help").argv;

  const ignores: string[] =
    typeof params.ignores === "string" || params.ignores instanceof String
      ? (params.ignores as string).split(",")
      : [];

  const { snippets } = params;

  const listeners: Listener[] = [];

  // If a file contains the state command, the processor will generate multiple
  // versions of the same file. Keep track of whether a state file was written
  // for the desired state name. We can also use this to diagnose possible typos
  // in params.state.
  const stateVersionWrittenForPath: {
    [path: string]: boolean;
  } = {};

  let onBinaryFile: ((path: string) => void) | undefined = undefined;
  // Output snippet files -- exclude full state files
  if (snippets) {
    listeners.push((result: ParseResult): void | Promise<void> => {
      const { source } = result;
      if (source.attributes["snippet"] === undefined) {
        return;
      }
      const targetPath = path.join(destination, source.basename);

      // Special handler for snippets in state commands
      if (params.state) {
        const stateAttribute = source.attributes["state"];
        if (stateAttribute && stateAttribute !== params.state) {
          // Not the requested state
          return;
        }
        const stateVersionWritten = stateVersionWrittenForPath[source.path];
        if (stateVersionWritten === true) {
          // Already wrote state version, so nothing more to do. This prevents a
          // non-state version from overwriting the desired state version.
          return;
        }
        if (stateAttribute === params.state) {
          stateVersionWrittenForPath[source.path] = true;
        }
      }
      return new Promise((resolve, reject) => {
        fs.writeFile(targetPath, source.text.toString(), "utf8", (error) => {
          if (error) {
            return reject(error);
          }
          console.log(`${source.path} -> ${targetPath}`);
          resolve();
        });
      });
    });
  } else if (params.state) {
    const sourceParam = params.source as string;
    const projectRoot = !fs.lstatSync(sourceParam as string).isDirectory()
      ? path.dirname(sourceParam)
      : sourceParam;
    onBinaryFile = (filePath: string) => {
      // Copy binary files directly
      const directory = path.join(
        params.destination as string,
        path.relative(projectRoot, path.dirname(filePath))
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
          console.log(`copied binary file ${filePath} -> ${targetPath}`);
        });
      });
    };
    listeners.push((result: ParseResult): void | Promise<void> => {
      const { source } = result;
      if (source.attributes.snippet) {
        // Not a pure state file
        return;
      }

      const { state } = source.attributes;

      if (state && state !== params.state) {
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
      if (state === params.state) {
        stateVersionWrittenForPath[source.path] = true;
      }

      return new Promise((resolve, reject) => {
        // Use the same relative path
        const directory = path.join(
          destination,
          path.relative(projectRoot, path.dirname(source.path))
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
            console.log(`${source.path} -> ${targetPath}`);
            resolve();
          });
        });
      });
    });
  }

  const source = params.source as string;
  const destination = params.destination as string;
  await bhp.main(source, ignores, listeners, onBinaryFile);

  if (params.state && Object.keys(stateVersionWrittenForPath).length === 0) {
    console.warn(
      `Warning: state '${params.state}' never found in source ${source}`
    );
  }
}

run().catch((err) => {
  output.addError(err);
  console.error(err);
});

export default run;
