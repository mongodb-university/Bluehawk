import { AnyTagNode } from "../parser";
import Ajv, { AnySchema } from "ajv";
import { Rule, ValidateCstResult } from "./validator";

const ajv = new Ajv();

// Creates a rule that checks attributes against the given JSON schema.
export const makeAttributesConformToJsonSchemaRule = <Type = unknown>(
  schema: AnySchema
): Rule => {
  const validate = ajv.compile(schema);
  return (
    { attributes, range, tagName }: AnyTagNode,
    result: ValidateCstResult
  ) => {
    if (validate(attributes)) {
      return;
    }
    if (validate.errors?.length === 1 && attributes === undefined) {
      // Provide an exception for attributes being 'undefined' instead of null
      const { instancePath, params, message } = validate.errors[0];
      if (
        instancePath === "" &&
        params.type === "null" &&
        message === "must be null"
      ) {
        return;
      }
    }
    result.errors.push({
      component: "validator",
      location: range.start,
      message: ajv.errorsText(validate.errors, {
        separator: "\n",
        dataVar: `attribute list for '${tagName}' tag`,
      }),
    });
  };
};
