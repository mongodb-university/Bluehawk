import { WithActionReporter, ActionReporter } from "./ActionReporter";
import * as path from "path";
import { getBluehawk, EmphasizeSourceAttributes } from "../../bluehawk";
import { System } from "../../bluehawk/io/System";
import { ActionArgs } from "./ActionArgs";
import { ProcessResult } from "../../bluehawk/processor/Processor";
import { logErrorsToConsole } from "../../bluehawk/OnErrorFunction";

type Format = "rst" | "docusaurus" | "md";

export interface SnipArgs extends ActionArgs {
  paths: string[];
  output: string;
  state?: string;
  id?: string | string[];
  ignore?: string | string[];
  format?: Format | Format[];
}

export const createFormattedCodeBlock = async ({
  format,
  result,
  output,
  reporter,
}: {
  result: ProcessResult;
  output: string;
  format: string;
  reporter: ActionReporter;
}): Promise<void> => {
  if (format === "rst") {
    const formattedSnippet = await formatInRst(result);
    if (formattedSnippet === undefined) {
      return;
    }

    const { document } = result;
    const targetPath = path.join(output, `${document.basename}.rst`);
    await System.fs.writeFile(targetPath, formattedSnippet, "utf8");

    reporter.onFileWritten({
      type: "text",
      inputPath: document.path,
      outputPath: targetPath,
    });
  } else if (format === "md") {
    const formattedSnippet = formatInMd(result);
    if (formattedSnippet === undefined) {
      return;
    }
    const { document } = result;
    const targetPath = path.join(output, `${document.basename}.md`);
    await System.fs.writeFile(targetPath, formattedSnippet, "utf8");
    reporter.onFileWritten({
      type: "text",
      inputPath: document.path,
      outputPath: targetPath,
    });
  } else if (format === "docusaurus") {
    const formattedSnippet = await formatInDocusaurus(result);
    if (formattedSnippet === undefined) {
      return;
    }
    const { document } = result;
    const targetPath = path.join(output, `${document.basename}.md`);
    await System.fs.writeFile(targetPath, formattedSnippet, "utf8");
    reporter.onFileWritten({
      type: "text",
      inputPath: document.path,
      outputPath: targetPath,
    });
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
    [".cpp", "cpp"],
    [".cs", "csharp"],
    [".gradle", "groovy"],
    [".java", "java"],
    [".js", "javascript"],
    [".json", "json"],
    [".kt", "kotlin"],
    [".m", "objectivec"],
    [".swift", "swift"],
    [".ts", "typescript"],
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
      rstEmphasizeRanges.push({
        // ternary operator here because start or end are both optional, but one of them must be defined
        start: start !== undefined ? start.line : end!.line,
        end: end !== undefined ? end.line : start!.line,
      });
    }

    rstFormattedRanges = rstEmphasizeRanges
      .map((range) =>
        range.start === range.end
          ? `${range.start}`
          : `${range.start}-${range.end}`
      )
      .join(", ");
  }

  const formattedSnippet = [
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
  return formattedSnippet;
};

export const formatInMd = (result: ProcessResult): string | undefined => {
  const { document } = result;
  const snippet = document.attributes["snippet"];
  if (snippet === undefined) {
    return undefined;
  }
  const language = document.extension.slice(1);
  const startBackticks = ["```", language, "\n\n"].join("");
  const endBackticks = "\n```";

  return startBackticks + document.text.toString() + endBackticks;
};

export const formatInDocusaurus = async (
  result: ProcessResult
): Promise<string | undefined> => {
  const { document } = result;
  if (document.attributes["snippet"] === undefined) {
    return undefined;
  }

  // get the list of emphasize ranges, converting individual emphasize lines to ranges for simplicity
  const emphasizeAttributes = document.attributes[
    "emphasize"
  ] as EmphasizeSourceAttributes;
  const emphasizeRanges: { start: number; end: number }[] = [];
  if (emphasizeAttributes !== undefined) {
    for (const range of emphasizeAttributes.ranges) {
      const start = await document.getNewLocationFor(range.start);
      const end = await document.getNewLocationFor(range.end);
      emphasizeRanges.push({
        // ternary operator here because start or end are both optional, but one of them must be defined
        start: start !== undefined ? start.line : end!.line,
        end: end !== undefined ? end.line : start!.line,
      });
    }
  }

  // insert docusaurus higlight magic tags at start and end of ranges, inserting in reverse order to keep line numbers stable
  const lines = document.text.toString().split(/\r\n|\r|\n/);
  if (emphasizeRanges.length > 0) {
    emphasizeRanges.reverse().forEach((range) => {
      // subtract one from the line numbers because the array is zero-indexed, but the lines are one-indexed
      lines.splice(range.end, 0, "// highlight-end");
      lines.splice(range.start - 1, 0, "// highlight-start");
    });
  }

  // pop some newlines in between those lines so it doesn't come out as one long single-line spew of insanity
  return lines.join("\n");
};
export const snip = async (
  args: WithActionReporter<SnipArgs>
): Promise<void> => {
  const { paths, output, state, id, ignore, waitForListeners, reporter } = args;
  const formats =
    args.format && !Array.isArray(args.format) ? [args.format] : args.format;
  const errors: string[] = [];
  const bluehawk = await getBluehawk();

  // If a file contains the state tag, the processor will generate multiple
  // versions of the same file. Keep track of whether a state file was written
  // for the desired state name. We can also use this to diagnose possible typos
  // in params.state.
  const stateVersionWrittenForPath: {
    [path: string]: boolean;
  } = {};

  // Used to make sure all ids passed through the CLI appear in files.
  const idsUsed: Set<string> = new Set();

  // Define the handler for generating snippet files.
  bluehawk.subscribe(async (result) => {
    const { document, parseResult } = result;
    if (document.attributes["snippet"] === undefined) {
      return;
    }
    const targetPath = path.join(output, document.basename);

    // Special handler for snippets in state tags
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

    if (id !== undefined) {
      const idAttribute: string = document.attributes["snippet"];

      if (![id].flat(1).includes(idAttribute)) {
        // Not the requested id
        return;
      }

      idsUsed.add(idAttribute);
    }

    try {
      await System.fs.writeFile(targetPath, document.text.toString(), "utf8");
      reporter.onFileWritten({
        type: "text",
        inputPath: document.path,
        outputPath: targetPath,
      });

      // Create formatted snippet block
      if (formats !== undefined) {
        for (const format of formats) {
          await createFormattedCodeBlock({
            result,
            output,
            format,
            reporter,
          });
        }
      }
    } catch (error) {
      reporter.onWriteFailed({
        type: "text",
        outputPath: targetPath,
        inputPath: parseResult.source.path,
        error,
      });
    }
  });

  await bluehawk.parseAndProcess(paths, {
    reporter,
    ignore,
    waitForListeners: waitForListeners ?? false,
    onErrors(inputPath, errors) {
      reporter.onBluehawkErrors({
        inputPath,
        errors,
      });
    },
  });

  if (state && Object.keys(stateVersionWrittenForPath).length === 0) {
    reporter.onStateNotFound({
      state,
      paths,
    });
  }

  // if an id was not used, print a warning
  {
    // use a set to remove duplicate ids and to narrow type of id
    const dedupIds = typeof id === "string" ? new Set([id]) : new Set(id);
    if (id && idsUsed.size !== dedupIds.size) {
      const unused = Array.from(dedupIds).filter((x) => !idsUsed.has(x));
      reporter.onIdsUnused({
        ids: unused,
        paths,
      });
    }
  }
};
