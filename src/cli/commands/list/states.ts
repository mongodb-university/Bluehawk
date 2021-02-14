import { Arguments, CommandModule } from "yargs";
import {
  getBluehawk,
  Project,
  parseAndProcessProject,
} from "../../../bluehawk";
import { MainArgs } from "../../cli";
import { withIgnoreOption, withJsonOption } from "../../options";

interface ListStatesArgs extends MainArgs {
  paths: string[];
  json?: boolean;
  ignore?: string | string[];
}

export const listStates = async (
  args: Arguments<ListStatesArgs>
): Promise<void> => {
  const { ignore, json, paths, plugin } = args;
  const bluehawk = await getBluehawk(plugin);

  const statesFound = new Set<string>();
  bluehawk.subscribe((result) => {
    const { source } = result;
    const { state } = source.attributes;
    if (state === undefined) {
      return;
    }
    statesFound.add(state as string);
  });

  await Promise.all(
    paths.map(async (rootPath) => {
      const project: Project = {
        rootPath,
        ignore,
      };
      await parseAndProcessProject(project, bluehawk);
    })
  );

  if (json) {
    console.log(
      JSON.stringify({ paths, ignore, plugin, states: Array.from(statesFound) })
    );
    return;
  }

  if (statesFound.size === 0) {
    console.log(`no states found in ${paths}`);
    return;
  }

  console.log(
    `states found:\n${Array.from(statesFound)
      .map((s) => `- ${s}`)
      .join("\n")}`
  );
};

const commandModule: CommandModule<
  MainArgs & { paths: string[] },
  ListStatesArgs
> = {
  command: "states <paths..>",
  builder(argv) {
    return withJsonOption(withIgnoreOption(argv));
  },
  async handler(args) {
    return await listStates(args);
  },
  aliases: [],
  describe: "list states used in the given project",
};

export default commandModule;
