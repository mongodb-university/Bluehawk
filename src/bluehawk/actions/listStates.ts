import { getBluehawk } from "../../bluehawk";
import { ActionArgs } from "./ActionArgs";
import { printJsonResult } from "./printJsonResult";

export interface ListStatesArgs extends ActionArgs {
  paths: string[];
  json?: boolean;
  ignore?: string | string[];
}

export const listStates = async (args: ListStatesArgs): Promise<void> => {
  const { ignore, json, paths, waitForListeners } = args;
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
    waitForListeners: waitForListeners ?? false,
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
