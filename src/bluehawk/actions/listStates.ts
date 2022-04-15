import { getBluehawk } from "../../bluehawk";
import { ActionArgs } from "./ActionArgs";
import { printJsonResult } from "./printJsonResult";

export interface ListStatesArgs extends ActionArgs {
  paths: string[];
  json?: boolean;
  ignore?: string | string[];
}

export const listStates = async (args: ListStatesArgs): Promise<void> => {
  const { ignore, json, paths, waitForListeners, reporter } = args;
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
    reporter,
    ignore,
    waitForListeners: waitForListeners ?? false,
  });

  if (json) {
    printJsonResult(args, { states: Array.from(statesFound) });
    return;
  }

  reporter.onStatesFound({
    action: "listStates",
    paths,
    statesFound: Array.from(statesFound),
  });
};
