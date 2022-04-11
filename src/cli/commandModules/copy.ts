import { CommandModule, Arguments, Argv } from "yargs";
import {
  withDestinationOption,
  withStateOption,
  withIgnoreOption,
  ActionArgs,
  CopyArgs,
  copy,
} from "../..";

const commandModule: CommandModule<
  ActionArgs & { rootPath: string },
  CopyArgs
> = {
  command: "copy <rootPath>",
  builder: (yargs): Argv<CopyArgs> => {
    return withIgnoreOption(withStateOption(withDestinationOption(yargs)));
  },
  handler: async (args: Arguments<CopyArgs>) => {
    const { errors, filesCopied } = await copy(args);
    filesCopied.forEach(({ fromPath, toPath, type, errorMessage }) => {
      console.log(
        `${
          errorMessage === undefined ? "Copied" : "FAILED:"
        } ${type} file ${fromPath} -> ${toPath}${
          errorMessage === undefined ? "" : `: ${errorMessage}`
        }`
      );
    });

    console.log(
      `Processed ${filesCopied.length} files
- ${filesCopied.filter(({ type }) => type === "binary").length} binary files
- ${filesCopied.filter(({ type }) => type === "text").length} text files
- ${
        filesCopied.filter(({ errorMessage }) => errorMessage !== undefined)
          .length
      } errors`
    );
    if (errors.length !== 0) {
      console.error(
        `Exiting with ${errors.length} error${errors.length === 1 ? "" : "s"}.`
      );
      process.exit(1);
    }
  },
  aliases: [],
  describe:
    "clone source project to destination with Bluehawk commands processed",
};

export default commandModule;
