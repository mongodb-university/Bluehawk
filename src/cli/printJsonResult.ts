import { Arguments } from "yargs";
import { version } from "../../package.json";

// Given the --json flag, prints results with additional useful information in a
// uniform way
export function printJsonResult<T extends { json?: boolean }>(
  args: Arguments<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: Record<string, any>
): void {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { $0, _, json, ...info } = args; // Copy the args for output, minus a few
  console.log(
    JSON.stringify({
      bluehawkVersion: version,
      ...info,
      ...result,
    })
  );
}
