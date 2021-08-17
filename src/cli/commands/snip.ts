import * as path from "path";
import { CommandModule, Arguments, Argv } from "yargs";
import { getBluehawk, EmphasizeSourceAttributes } from "../../bluehawk";
import {
  withDestinationOption,
  withStateOption,
  withIdOption,
  withIgnoreOption,
  withGenerateFormattedCodeSnippetsOption,
} from "../options";
import { System } from "../../bluehawk/io/System";
import { MainArgs } from "../cli";
import { ProcessResult } from "../../bluehawk/processor/Processor";
import { logErrorsToConsole } from "../../bluehawk/OnErrorFunction";

interface SnipArgs extends MainArgs {
  paths: string[];
  destination: string;
  state?: string;
  id?: string | string[];
  ignore?: string | string[];
  format?: "rst";
}

export const createFormattedCodeBlock = async (
  result: ProcessResult,
  destination: string,
  format: string
): Promise<void> => {
  if (format === "rst") {
    const formattedCodeblock = await formatInRst(result);

    const { document } = result;
    const targetPath = path.join(
      destination,
      `${document.basename}.code-block.rst`
    );
    await System.fs.writeFile(targetPath, formattedCodeblock, "utf8");
  } // add additional elses + "formatInLanguage" methods to handle other markup languages
};

export const formatInRst = async (
  result: ProcessResult
): Promise<string | undefined> => {
  const { document } = result;
  if (document.attributes["snippet"] === undefined) {
    return undefined;
  }

  const emphasizeAttributes = document.attributes[
    "emphasize"
  ] as EmphasizeSourceAttributes;

  // nasty hack to cover the suffixes/rst languages we use most often
  // TODO: switch to a better mapping
  const rstLanguageMap: Map<string, string> = new Map([
    [".js", "javascript"],
    [".ts", "typescript"],
    [".kt", "kotlin"],
    [".java", "java"],
    [".gradle", "groovy"],
    [".m", "objectivec"],
    [".swift", "swift"],
    [".cs", "csharp"],
    [".json", "json"],
  ]);
  const rstLanguage = rstLanguageMap.has(document.extension)
    ? rstLanguageMap.get(document.extension)
    : "text";

  const rstHeader = ".. code-block::";
  const rstEmphasizeModifier = ":emphasize-lines:";

  const rstEmphasizeRanges: { start: number; end: number }[] = [];
  let rstFormattedRanges = undefined;
  if (emphasizeAttributes !== undefined) {
    for (const range of emphasizeAttributes.ranges) {
      const start = await document.getNewLocationFor(range.start);
      const end = await document.getNewLocationFor(range.end);
      if (start !== undefined && end !== undefined) {
        rstEmphasizeRanges.push({ start: start.line, end: end.line });
      }
    }

    rstFormattedRanges = rstEmphasizeRanges
      .map((range) =>
        range.start === range.end
          ? `${range.start}`
          : `${range.start}-${range.end}`
      )
      .join(", ");
  }

  const formattedCodeblock = [
    `${rstHeader} ${rstLanguage}`,
    rstFormattedRanges === undefined
      ? ``
      : `   ${rstEmphasizeModifier} ${rstFormattedRanges}\n`,
    document.text
      .toString()
      .split(/\r\n|\r|\n/)
      .map((line) => (line === "" ? line : `   ${line}`)) // indent each line 3 spaces
      .join("\n"),
  ].join("\n");
  return formattedCodeblock;
};

export const snip = async (args: SnipArgs): Promise<string[]> => {
  const { paths, destination, state, id, ignore, format, waitForListeners } = args;
  const errors: string[] = [];
  const bluehawk = await getBluehawk();

  // If a file contains the state command, the processor will generate multiple
  // versions of the same file. Keep track of whether a state file was written
  // for the desired state name. We can also use this to diagnose possible typos
  // in params.state.
  const stateVersionWrittenForPath: {
    [path: string]: boolean;
  } = {};

  // Define the handler for generating snippet files.
  bluehawk.subscribe(async (result) => {
    const { document, parseResult } = result;
    if (document.attributes["snippet"] === undefined) {
      return;
    }
    const targetPath = path.join(destination, document.basename);

    // Special handler for snippets in state commands
    if (state !== undefined) {
      const stateAttribute = document.attributes["state"];
      if (stateAttribute && stateAttribute !== state) {
        // Not the requested state
        return;
      }
      const stateVersionWritten = stateVersionWrittenForPath[document.path];
      if (stateVersionWritten === true) {
        // Already wrote state version, so nothing more to do. This prevents a
        // non-state version from overwriting the desired state version.
        return;
      }
      if (stateAttribute === state) {
        stateVersionWrittenForPath[document.path] = true;
      }
    }

    if (id !== undefined) {
      const idAttribute: string = document.attributes["snippet"];
      if (typeof id === "string"){
        if (idAttribute && idAttribute === id) {
          // Not the requested id
          return;
        }
      }
      else {
         if (idAttribute && !id.includes(idAttribute)) {
           // Not the requested id
           return;
         }
      }
    }

    try {
      await System.fs.writeFile(targetPath, document.text.toString(), "utf8");

      // Create formatted snippet block
      if (format !== undefined) {
        await createFormattedCodeBlock(result, destination, format);
      }
    } catch (error) {
      const message = `Failed to write ${targetPath} (based on ${parseResult.source.path}): ${error.message}`;
      console.error(message);
      errors.push(message);
    }
  });

  await bluehawk.parseAndProcess(paths, {
    ignore,
    waitForListeners: waitForListeners ?? false,
    onErrors(filepath, newErrors) {
      logErrorsToConsole(filepath, newErrors);
      errors.push(...newErrors.map((e) => e.message));
    },
  });

  if (state && Object.keys(stateVersionWrittenForPath).length === 0) {
    const message = `Warning: state '${state}' never found in ${paths.join(
      ", "
    )}`;
    console.warn(message);
    errors.push(message);
  }

  return errors;
};

const commandModule: CommandModule<MainArgs & { paths: string[] }, SnipArgs> = {
  command: "snip <paths..>",
  builder: (yargs): Argv<SnipArgs> => {
    return withIgnoreOption(
      withStateOption(
        withIdOption(
          withDestinationOption(withGenerateFormattedCodeSnippetsOption(yargs))
        )
      )
    );
  },
  handler: async (args: Arguments<SnipArgs>) => {
    const errors = await snip(args);
    if (errors.length !== 0) {
      console.error(
        `Exiting with ${errors.length} error${errors.length === 1 ? "" : "s"}.`
      );
      process.exit(1);
    }
  },
  aliases: [],
  describe: "extract snippets",
};

export default commandModule;
