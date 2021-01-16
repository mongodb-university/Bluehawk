import { Rule } from "./validator";
import { ProcessRequest } from "./Processor";

// The implementation that actually carries out the command.

export interface CommandProcessor {
  // Rules to determine if the command meets requirements before processing is
  // possible
  rules: Rule[];

  // Implementation of the command
  process: (request: ProcessRequest) => void;
}
