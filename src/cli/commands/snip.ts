import { CommandModule, Arguments, Argv } from "yargs";
import { Listener, ParseResult } from "../../bluehawk";
import {
  withDestinationOption,
  withPluginOption,
  withStateOption,
} from "../options";

interface SnipArgs {
  paths: string[];
  destination: string;
  plugin?: string | string[];
  state?: string;
}

const commandModule: CommandModule<SnipArgs, SnipArgs> = {
  command: "snip <paths..>",
  builder: (yargs) => {
    return withPluginOption(withStateOption(withDestinationOption(yargs)));
  },
  async handler(args: Arguments<SnipArgs>): Promise<void> {
    /*
    // If a file contains the state command, the processor will generate multiple
    // versions of the same file. Keep track of whether a state file was written
    // for the desired state name. We can also use this to diagnose possible typos
    // in params.state.
    const stateVersionWrittenForPath: {
      [path: string]: boolean;
    } = {};
    const listener: Listener = (result: ParseResult): void | Promise<void> => {
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
      return new Promise((resolve, reject) => {
        fs.writeFile(targetPath, source.text.toString(), "utf8", (error) => {
          if (error) {
            return reject(error);
          }
          resolve();
        });
      });
    };
    await bhp.main(paths[0], undefined, [listener], undefined, undefined);
    */
    console.log(args);
  },
  aliases: [],
  describe: "extract snippets",
};

export default commandModule;
