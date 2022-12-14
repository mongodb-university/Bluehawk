import { JSONSchemaType } from "ajv";
import { TagNodeImpl, TagNodeAttributes, AnyTagNode } from "./TagNode";
import { Range } from "../Range";
import { makeAttributesConformToJsonSchemaRule } from "./makeAttributesConformToJsonSchemaRule";
import { ValidateCstResult } from "./validator";

describe("makeAttributesConformToJsonSchemaRule", () => {
  const mockRange: Range = {
    start: {
      column: 1,
      line: 1,
      offset: 0,
    },
    end: {
      column: 10,
      line: 1,
      offset: 9,
    },
  };
  const makeValidateCstResult = (): ValidateCstResult => {
    return {
      tagsById: new Map(),
      errors: [],
    };
  };

  const mockTagNode = (attributes?: TagNodeAttributes): AnyTagNode => {
    const node = TagNodeImpl.rootTag();
    node.tagName = "mock";
    node.range = mockRange;
    node.attributes = attributes;
    return node as AnyTagNode;
  };

  type MyType = {
    requiredNumber: number;
    notNegative?: number;
  };

  it("reports errors", () => {
    const rule = makeAttributesConformToJsonSchemaRule<MyType>({
      type: "object",
      properties: {
        requiredNumber: { type: "number" },
        notNegative: { type: "number", minimum: 0, nullable: true },
      },
      required: ["requiredNumber"],
      additionalProperties: false,
    });
    const result = makeValidateCstResult();
    rule(
      mockTagNode({
        // missing requiredNumber
        notNegative: -1, // invalid value
      }),
      result
    );
    expect(result.errors).toStrictEqual([
      {
        component: "validator",
        location: {
          column: 1,
          line: 1,
          offset: 0,
        },
        message:
          "attribute list for 'mock' tag must have required property 'requiredNumber'",
      },
    ]);
  });

  it("reports errors one at a time", () => {
    const rule = makeAttributesConformToJsonSchemaRule<MyType>({
      type: "object",
      properties: {
        requiredNumber: { type: "number" },
        notNegative: { type: "number", minimum: 0, nullable: true },
      },
      required: ["requiredNumber"],
      additionalProperties: false,
    });
    let result = makeValidateCstResult();
    rule(
      mockTagNode({
        // missing requiredNumber
        notNegative: -1,
      }),
      result
    );
    expect(result.errors.map((error) => error.message)).toStrictEqual([
      "attribute list for 'mock' tag must have required property 'requiredNumber'",
    ]);
    result = makeValidateCstResult();
    rule(
      mockTagNode({
        // fix first issue
        requiredNumber: 1,
        notNegative: -1,
      }),
      result
    );
    expect(result.errors.map((error) => error.message)).toStrictEqual([
      "attribute list for 'mock' tag/notNegative must be >= 0",
    ]);
    result = makeValidateCstResult();
    rule(
      mockTagNode({
        requiredNumber: 1,
        // fix second issue
        notNegative: 1,
      }),
      result
    );
    expect(result.errors.map((error) => error.message)).toStrictEqual([]);
  });

  it("reports errors on undefined attributes", () => {
    const result = makeValidateCstResult();
    const rule = makeAttributesConformToJsonSchemaRule<MyType>({
      type: "object",
      properties: {
        requiredNumber: { type: "number" },
        notNegative: { type: "number", minimum: 0, nullable: true },
      },
      required: ["requiredNumber"],
      additionalProperties: false,
    });
    rule(mockTagNode(), result);
    expect(result.errors[0].message).toBe(
      "attribute list for 'mock' tag must be object"
    );
  });

  it("throws on malformed schema", () => {
    expect(() => {
      makeAttributesConformToJsonSchemaRule({
        type: "badType",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any as JSONSchemaType<MyType>);
    }).toThrow(
      "schema is invalid: data/type must be equal to one of the allowed values, data/type must be array, data/type must match a schema in anyOf"
    );
  });
});
