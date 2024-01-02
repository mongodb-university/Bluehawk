import { Argv, Options } from "yargs";

function option<T, K extends string, O extends Options & { once?: boolean }>(
  yargs: Argv<T>,
  key: K,
  options: O
) {
  return yargs.option(key, options).check((argv) => {
    if (options.once && Array.isArray(argv[key])) {
      throw new Error(`Cannot accept option '${key}' multiple times`);
    }
    return true;
  });
}

export function withOutputOption<T>(
  yargs: Argv<T>
): Argv<T & { output: string }> {
  return option(yargs, "output", {
    alias: "o",
    string: true,
    describe: "the output directory",
    required: true,
    once: true,
  }).check((argv) => !Array.isArray(argv.state));
}

export function withIgnoreOption<T>(
  yargs: Argv<T>
): Argv<T & { ignore?: string | string[] }> {
  return option(yargs, "ignore", {
    alias: "i",
    string: true,
    describe:
      "ignore a certain file pattern (like gitignore) when traversing project files. Provide paths relative to project root.",
  });
}

export function withStateOption<T>(
  yargs: Argv<T>
): Argv<T & { state?: string }> {
  return option(yargs, "state", {
    string: true,
    describe: "select snippets etc. from the given state",
    once: true,
  });
}

export function withRenameOption<T>(
  yargs: Argv<T>
): Argv<T & { rename?: string }> {
  return option(yargs, "rename", {
    string: true,
    describe: "rename files during copy",
    once: true,
  });
}

export function withIdOption<T>(
  yargs: Argv<T>
): Argv<T & { id?: string | string[] }> {
  return option(yargs, "id", {
    string: true,
    describe: "select snippets with a specific id",
  });
}

export function withGenerateFormattedCodeSnippetsOption<T>(
  yargs: Argv<T>
): Argv<T & { generateFormattedCodeSnippets?: string }> {
  return option(yargs, "format", {
    requiresArg: true,
    choices: ["rst", "docusaurus"],
    alias: "f",
    string: true,
    describe:
      "generate code snippets with markup formatting, e.g. emphasized lines, specified language",
    once: true,
  });
}

export function withJsonOption<T>(
  yargs: Argv<T>
): Argv<T & { json?: boolean }> {
  return option(yargs, "json", {
    boolean: true,
    describe: "output as json",
    once: true,
  });
}

export function withLogLevelOption<T>(
  yargs: Argv<T>
): Argv<T & { logLevel?: number }> {
  return option(yargs, "logLevel", {
    number: true,
    describe:
      "set the reporter log level. 0=none, 1=errors only, 2=warnings & above, 3=all",
    once: true,
  });
}

export function withConfigOption<T>(
  yargs: Argv<T>
): Argv<T & { configPath?: string }> {
  return option(yargs, "configPath", {
    alias: "c",
    string: true,
    describe: "path to your project's root Bluehawk config file",
    once: true,
  }).check((argv) => !Array.isArray(argv.state));
}
