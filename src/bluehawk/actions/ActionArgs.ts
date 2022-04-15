import { ActionReporter } from "./ActionReporter";
export interface ActionArgs {
  reporter: ActionReporter;
  waitForListeners?: boolean;
}
