import { Rule } from "../processor/validator";
import { ProcessRequest } from "../processor/Processor";

// The implementation that actually carries out the command.

export interface Command {
  // Rules to determine if the command meets requirements before processing is
  // possible
  rules: Rule[];

  // Implementation of the command
  process: (request: ProcessRequest) => void;
}
