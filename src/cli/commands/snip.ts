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
  format?: string;
}

export const doRst = async (
  result: ParseResult
): Promise<string | undefined> => {
  const { source } = result;
  if (
    source.attributes["snippet"] === undefined ||
    source.attributes["emphasize"] === undefined
  ) {
    return undefined;
  }

  // nasty hack to cover the suffixes/rst languages we use most often with Realm.
  // TODO: switch to a better mapping
  const rstLanguageMap: Map<string, string> = new Map([
    [".js", "javascript"],
    [".ts", "typescript"],
    [".kt", "kotlin"],
    [".java", "java"],
    [".gradle", "groovy"],
    [".objc", "objective-c"],
    [".swift", "swift"],
    [".cs", "csharp"],
    [".json", "json"],
  ]);
  const rstLanguage = rstLanguageMap.has(source.language)
    ? rstLanguageMap.get(source.language)
    : "text";

  const rstHeader = ".. code-block::";
  const rstEmphasizeModifier = ":emphasize-lines:";

  const rstEmphasizeRanges = [];
  for (const range of source.attributes["emphasize"]["ranges"]) {
    const start = await source.getNewLocationFor(range.start);
    const end = await source.getNewLocationFor(range.end);
    if (start !== undefined && end !== undefined) {
      if (start.line != end.line) {
        end.line--; // TODO: address this hack, which prevents us from going "one over" with range ends
      }
      rstEmphasizeRanges.push({ start: start.line, end: end.line });
    }
  }

  const rstFormattedRanges = rstEmphasizeRanges
    .map((range) =>
      range.start === range.end
        ? `${range.start}`
        : `${range.start}-${range.end}`
    )
    .join(", ");

  const formattedCodeblock = [
    `${rstHeader} ${rstLanguage}`,
    `   ${rstEmphasizeModifier} ${rstFormattedRanges}`,
    "", // empty line required between rst codeblock declaration and content
    source.text
      .toString()
      .split(/\r\n|\r|\n/)
      .map((line) => (line === "" ? line : `   ${line}`))
      .join("\n"),
  ].join("\n");
  return formattedCodeblock;
};

export const snip = async (args: SnipArgs): Promise<void> => {
  const { paths, destination, plugin, state, ignore, format } = args;
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

  if (format !== undefined) {
    // Define the handler for generating formatted snippet files.
    bluehawk.subscribe(async (result: ParseResult) => {
      const formattedCodeblock = await doRst(result);
      if (formattedCodeblock === undefined) {
        return;
      }
      const { source } = result;
      const targetPath = path.join(
        destination,
        `${source.basename}.code-block.rst`
      );

      try {
        await System.fs.writeFile(targetPath, formattedCodeblock, "utf8");
      } catch (error) {
        console.error(
          `Failed to write ${targetPath} (based on ${source.path}): ${error.message}`
        );
      }
    });
  }

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
