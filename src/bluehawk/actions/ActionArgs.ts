import { LogLevel } from "./ActionReporter";
export interface ActionArgs {
  logLevel?: LogLevel;
  waitForListeners?: boolean;
}
