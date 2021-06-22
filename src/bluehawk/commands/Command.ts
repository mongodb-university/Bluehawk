import { Rule } from "../processor/validator";
import { ProcessRequest } from "../processor/Processor";
import { AnySchema, JSONSchemaType } from "ajv";
import { AnyCommandNode, BlockCommandNode, LineCommandNode } from "../parser";

interface Command {
  // The command name. For block commands this should not include -start or
  // -end.
  name: string;

  // A helpful description of what the command is supposed to do
  description?: string;

  // JSON schema of the attributes list
  attributesSchema?: AnySchema;

  // Validator rules to determine if the command meets requirements before
  // processing is possible
  rules?: Rule[];
}

type NotPromise = void | Error;

// The implementation that actually carries out the command.
export interface AnyCommand extends Command {
  supportsBlockMode: boolean;
  supportsLineMode: boolean;
  process: (request: ProcessRequest) => NotPromise;
}

// Create a block command implementation. AttributesType is a type that
// represents the shape of the attributes list that users can place after the
// command start tag.
export function makeBlockCommand<AttributesType>(
  command: Command & {
    // Attributes schema applies to the block command version.
    attributesSchema: JSONSchemaType<AttributesType>;

    // The implementation of the command
    process: (request: ProcessRequest<BlockCommandNode>) => NotPromise;
  }
): AnyCommand {
  return {
    ...command,
    supportsLineMode: false,
    supportsBlockMode: true,
  } as AnyCommand;
}

// Create a line command implementation.
export function makeLineCommand(
  command: Command & {
    attributesSchema?: undefined;

    // The implementation of the command
    process: (request: ProcessRequest<LineCommandNode>) => NotPromise;
  }
): AnyCommand {
  return {
    ...command,
    supportsLineMode: true,
    supportsBlockMode: false,
  } as AnyCommand;
}

// Create a command implementation that can handle either blocks or lines.
export function makeBlockOrLineCommand<AttributesType>(
  command: Command & {
    /**
      Attributes schema applies to the block command version.
     */
    attributesSchema: JSONSchemaType<AttributesType>;

    /**
      The implementation of the command
     */
    // `void` return type alone is not enough to forbid async Commands.
    process: (request: ProcessRequest<AnyCommandNode>) => NotPromise;
  }
): AnyCommand {
  return { ...command, supportsLineMode: true, supportsBlockMode: true };
}

// Helper for commands that require one and only one id
export type IdRequiredAttributes = { id: string[] };
export const IdRequiredAttributesSchema: JSONSchemaType<IdRequiredAttributes> =
  {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "array",
        items: { type: "string" },
        minItems: 1,
        maxItems: 1,
      },
    },
  };

// Helper for commands that require at least one id
export type IdsRequiredAttributes = { id: string[] };
export const IdsRequiredAttributesSchema: JSONSchemaType<IdsRequiredAttributes> =
  {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "array", items: { type: "string" }, minItems: 1 },
    },
  };

export type NoAttributes = null;
export const NoAttributesSchema: JSONSchemaType<NoAttributes> = {
  type: "null",
  nullable: true,
};
