import { Rule } from "../processor/validator";
import { ProcessRequest } from "../processor/Processor";
import { AnySchema, JSONSchemaType } from "ajv";

// The implementation that actually carries out the command.

export interface AnyCommand {
  // A helpful description of what the command is supposed to do
  description?: string;

  // JSON schema of the attributes list
  attributesSchema?: AnySchema;

  // Validator rules to determine if the command meets requirements before
  // processing is possible
  rules: Rule[];

  // Implementation of the command
  process: (request: ProcessRequest) => void | Promise<void>;
}

export interface Command<AttributesType = unknown> extends AnyCommand {
  attributesSchema?: JSONSchemaType<AttributesType>;
}
