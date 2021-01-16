import { CommandNode } from "../parser/CommandNode";
import Ajv, { JSONSchemaType } from "ajv";
import { Rule, ValidateCstResult } from "./validator";

const ajv = new Ajv();

// Creates a rule that checks attributes against the given JSON schema.
export const makeAttributesConformToJsonSchemaRule = <Type>(
  schema: JSONSchemaType<Type>
): Rule => {
  const validate = ajv.compile(schema);
  return (
    { attributes, range, commandName }: CommandNode,
    result: ValidateCstResult
  ) => {
    if (validate(attributes)) {
      return;
    }
    result.errors.push({
      component: "validator",
      location: range.start,
      message: ajv.errorsText(validate.errors, {
        separator: "\n",
        dataVar: `attribute list for '${commandName}' command`,
      }),
    });
  };
};
