import * as path from "path";
import { getBluehawk, EmphasizeSourceAttributes } from "../../bluehawk";
import { System } from "../../bluehawk/io/System";
import { ActionArgs } from "./ActionArgs";
import { ProcessResult } from "../../bluehawk/processor/Processor";
import { logErrorsToConsole } from "../../bluehawk/OnErrorFunction";

export interface SnipArgs extends ActionArgs {
  paths: string[];
  destination: string;
  state?: string;
  id?: string | string[];
  ignore?: string | string[];
  format?: "rst" | "docusaurus";
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
  } else if (format === "docusaurus") {
    const formattedCodeblock = await formatInDocusaurus(result);

    const { document } = result;
    const targetPath = path.join(
      destination,
      `${document.basename}.code-block.md`
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
      rstEmphasizeRanges.push({
        // ternary operator here because start or end are both optional, but one of them must be defined
        start: start ? start.line : end!.line,
        end: end ? end.line : start!.line,
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
        start: start ? start.line : end!.line,
        end: end ? end.line : start!.line,
      });
    }
  }

  // insert docusaurus higlight magic tags at start and end of ranges, inserting in reverse order to keep line numbers stable
  const lines = document.text.toString().split(/\r\n|\r|\n/);
  if (emphasizeRanges.length > 0) {
    for (let i = emphasizeRanges.length - 1; i >= 0; --i) {
      // subtract one from the line numbers because the array is zero-indexed, but the lines are one-indexed
      lines.splice(emphasizeRanges[i].end, 0, "// highlight-end");
      lines.splice(emphasizeRanges[i].start - 1, 0, "// highlight-start");
    }
  }

  // pop some newlines in between those lines so it doesn't come out as one long single-line spew of insanity
  return lines.join("\n");
};

export const snip = async (args: SnipArgs): Promise<string[]> => {
  const { paths, destination, state, id, ignore, format, waitForListeners } =
    args;
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
    const targetPath = path.join(destination, document.basename);

    // Special handler for snippets in state tags
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

      if (![id].flat(1).includes(idAttribute)) {
        // Not the requested id
        return;
      }

      idsUsed.add(idAttribute);
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

  // if an id was not used, print a warning
  {
    // use a set to remove duplicate ids and to narrow type of id
    const dedupIds = typeof id === "string" ? new Set([id]) : new Set(id);
    if (id && idsUsed.size !== dedupIds.size) {
      const unused = Array.from(dedupIds).filter((x) => !idsUsed.has(x));
      const message = `Warning: the ids "${[...unused].join(
        " "
      )}" were not used. Is something misspelled?`;
      console.warn(message);
    }
  }

  return errors;
};
