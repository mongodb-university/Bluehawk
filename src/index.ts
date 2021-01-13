import * as yargs from "yargs";
import { MessageHandler } from "./messageHandler";
import * as fileHandler from "./fileHandler";
import * as bhp from "./fs/parseSource";
import fs from "fs";
import path from "path";
import { Bluehawk, BluehawkResult } from "./bluehawk";
import { Listener } from "./processors/Processor";

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

  let ignores: string[];
  if (typeof params.ignores == "string") {
    ignores = (params.ignores as string).split(",");
  }

  if (!params.type) {
    params.type = fileHandler.getFileType(params.source as string);
    output.addImportant(
      "I have auto-detected a file type of '" +
        params.type +
        "'. If this is incorrect, \nuse the --t or -type parameter to specify " +
        "the correct file type."
    );
  }

  const { snippets } = params;

  const listeners: Listener[] = [];

  // If a file contains the state command, the processor will generate multiple
  // versions of the same file. Keep track of whether a state file was written
  // for the desired state name. We can also use this to diagnose possible typos
  // in params.state.
  const stateVersionWrittenForPath: {
    [path: string]: boolean;
  } = {};

  // Output snippet files -- exclude full state files
  if (snippets) {
    listeners.push((result: BluehawkResult) => {
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

      fs.writeFile(targetPath, source.text.toString(), "utf8", (error) => {
        if (error) {
          throw error;
        }
        console.log(`${source.path} -> ${targetPath}`);
      });
    });
  } else if (params.state) {
    listeners.push((result: BluehawkResult) => {
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

      const sourceParam = params.source as string;
      const projectRoot = !fs.lstatSync(sourceParam as string).isDirectory()
        ? path.dirname(sourceParam)
        : sourceParam;

      // Use the same relative path
      const directory = path.join(
        destination,
        path.relative(projectRoot, path.dirname(source.path))
      );
      const targetPath = path.join(directory, source.basename);
      fs.mkdir(directory, { recursive: true }, (error) => {
        if (error) {
          throw error;
        }
        fs.writeFile(targetPath, source.text.toString(), "utf8", (error) => {
          if (error) {
            throw error;
          }
          console.log(`${source.path} -> ${targetPath}`);
        });
      });
    });
  }

  const source = params.source as string;
  const destination = params.destination as string;
  await bhp.main(source, ignores, listeners);

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
