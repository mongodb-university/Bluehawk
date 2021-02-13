import { Rule } from "../processor/validator";
import { ProcessRequest } from "../processor/Processor";
import { AnySchema, JSONSchemaType } from "ajv";
import { BlockCommandNode, LineCommandNode } from "../parser";

// The implementation that actually carries out the command.

export interface AnyCommand {
  // A helpful description of what the command is supposed to do
  description?: string;

  // JSON schema of the attributes list
  attributesSchema?: AnySchema;

  // Validator rules to determine if the command meets requirements before
  // processing is possible
  rules?: Rule[];
}

// A command can operate on a line or block.
export interface Command<AttributesType = unknown> extends AnyCommand {
  // Attributes schema applies to the block command version.
  attributesSchema: JSONSchemaType<AttributesType>;

  // The implementation of the command
  process: (request: ProcessRequest) => void | Promise<void>;
}

export interface BlockCommand<AttributesType = unknown> extends AnyCommand {
  attributesSchema: JSONSchemaType<AttributesType>;

  // The implementation of the command
  process: (request: ProcessRequest<BlockCommandNode>) => void | Promise<void>;
}

export interface LineCommand extends AnyCommand {
  // The implementation of the command
  process: (request: ProcessRequest<LineCommandNode>) => void | Promise<void>;
}

// Helper for commands that require IDs in the attributes only
export type IdRequiredAttributes = { id: string };
export const IdRequiredAttributesSchema: JSONSchemaType<IdRequiredAttributes> = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string" },
  },
};

export type NoAttributes = null;
export const NoAttributesSchema: JSONSchemaType<NoAttributes> = {
  type: "null",
  nullable: true,
};
