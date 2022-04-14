import { Rule } from "../processor/validator";
import { ProcessRequest } from "../processor/Processor";
import { AnySchema, JSONSchemaType } from "ajv";
import { AnyTagNode, BlockTagNode, LineTagNode } from "../parser";

interface Tag {
  // The tag name. For block tags this should not include -start or
  // -end.
  name: string;

  // A helpful description of what the tag is supposed to do
  description?: string;

  // JSON schema of the attributes list
  attributesSchema?: AnySchema;

  // Validator rules to determine if the tag meets requirements before
  // processing is possible
  rules?: Rule[];
}

type NotPromise = void | Error;

// The implementation that actually carries out the tag.
export interface AnyTag extends Tag {
  supportsBlockMode: boolean;
  supportsLineMode: boolean;
  process: (request: ProcessRequest) => NotPromise;
}

// Create a block tag implementation. AttributesType is a type that
// represents the shape of the attributes list that users can place after the
// tag start tag.
export function makeBlockTag<AttributesType>(
  tag: Tag & {
    // Attributes schema applies to the block tag version.
    attributesSchema: JSONSchemaType<AttributesType>;

    // The implementation of the tag
    process: (request: ProcessRequest<BlockTagNode>) => NotPromise;
  }
): AnyTag {
  return {
    ...tag,
    supportsLineMode: false,
    supportsBlockMode: true,
  } as AnyTag;
}

// Create a line tag implementation.
export function makeLineTag(
  tag: Tag & {
    attributesSchema?: undefined;

    // The implementation of the tag
    process: (request: ProcessRequest<LineTagNode>) => NotPromise;
  }
): AnyTag {
  return {
    ...tag,
    supportsLineMode: true,
    supportsBlockMode: false,
  } as AnyTag;
}

// Create a tag implementation that can handle either blocks or lines.
export function makeBlockOrLineTag<AttributesType>(
  tag: Tag & {
    /**
      Attributes schema applies to the block tag version.
     */
    attributesSchema: JSONSchemaType<AttributesType>;

    /**
      The implementation of the tag
     */
    // `void` return type alone is not enough to forbid async Tags.
    process: (request: ProcessRequest<AnyTagNode>) => NotPromise;
  }
): AnyTag {
  return { ...tag, supportsLineMode: true, supportsBlockMode: true };
}

// Helper for tags that require one and only one id
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

// Helper for tags that require at least one id
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
