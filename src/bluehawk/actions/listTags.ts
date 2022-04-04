import { getBluehawk } from "..";
import { ActionArgs } from "./ActionArgs";
import { printJsonResult } from "./printJsonResult";

export interface ListTagArgs extends ActionArgs {
  json?: boolean;
}

export const listTags = async (args: ListTagArgs): Promise<void> => {
  const { json } = args;
  const bluehawk = await getBluehawk();

  const { processor } = bluehawk;
  const { processors } = processor;

  if (json) {
    const tags = Object.entries(processors).map(([registeredName, tag]) => {
      const aliasOf = registeredName !== tag.name ? tag.name : undefined;
      const name = registeredName;
      const {
        description,
        supportsBlockMode,
        supportsLineMode,
        attributesSchema,
      } = tag;
      return {
        name,
        aliasOf,
        description,
        supportsBlockMode,
        supportsLineMode,
        attributesSchema,
      };
    });
    printJsonResult(args, { tags });
    return;
  }

  const tagsListText = Object.entries(processors)
    .map(([registeredName, tag]) => {
      const isAlias = registeredName !== tag.name;
      const name = isAlias
        ? `${registeredName} (alias of ${tag.name})`
        : tag.name;
      return `${name}\n${[
        `${tag.description ?? "No description"}`,
        `block mode supported: ${tag.supportsBlockMode ? "yes" : "no"}`,
        `line mode supported: ${tag.supportsLineMode ? "yes" : "no"}`,
        `attributes schema: ${
          tag.attributesSchema !== undefined
            ? JSON.stringify(tag.attributesSchema)
            : "N/A"
        }`,
      ]
        .map((s) => `  ${s}`)
        .join("\n")}`;
    })
    .join("\n\n");

  console.log(`available markup tags:\n\n${tagsListText}`);
};
