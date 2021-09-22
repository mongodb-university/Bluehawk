import { MainArgs } from "./actions";
import { version } from "../../../package.json";

// Given the --json flag, prints results with additional useful information in a
// uniform way
export function printJsonResult<T extends MainArgs & { json?: boolean }>(
  args: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: Record<string, any>
): void {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { json, ...info } = args; // Copy the args for output, minus json
  console.log(
    JSON.stringify({
      bluehawkVersion: version,
      ...info,
      ...result,
    })
  );
}
