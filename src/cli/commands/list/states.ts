import { Arguments, CommandModule } from "yargs";
import { getBluehawk } from "../../../bluehawk";
import { MainArgs } from "../../cli";
import { withIgnoreOption, withJsonOption } from "../../options";
import { printJsonResult } from "../../printJsonResult";

interface ListStatesArgs extends MainArgs {
  paths: string[];
  json?: boolean;
  ignore?: string | string[];
}

export const listStates = async (
  args: Arguments<ListStatesArgs>
): Promise<void> => {
  const { ignore, json, paths } = args;
  const bluehawk = await getBluehawk();

  const statesFound = new Set<string>();
  bluehawk.subscribe((result) => {
    const { document } = result;
    const { state } = document.attributes;
    if (state === undefined) {
      return;
    }
    statesFound.add(state as string);
  });

  await bluehawk.parseAndProcess(paths, {
    ignore,
  });

  if (json) {
    printJsonResult(args, { states: Array.from(statesFound) });
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
