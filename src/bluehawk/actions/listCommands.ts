import { getBluehawk } from "../../bluehawk";
import { ActionArgs } from "./ActionArgs";
import { printJsonResult } from "./printJsonResult";

export interface ListCommandArgs extends ActionArgs {
  json?: boolean;
}

export const listCommands = async (args: ListCommandArgs): Promise<void> => {
  const { json } = args;
  const bluehawk = await getBluehawk();

  const { processor } = bluehawk;
  const { processors } = processor;

  if (json) {
    const commands = Object.entries(processors).map(
      ([registeredName, command]) => {
        const aliasOf =
          registeredName !== command.name ? command.name : undefined;
        const name = registeredName;
        const {
          description,
          supportsBlockMode,
          supportsLineMode,
          attributesSchema,
        } = command;
        return {
          name,
          aliasOf,
          description,
          supportsBlockMode,
          supportsLineMode,
          attributesSchema,
        };
      }
    );
    printJsonResult(args, { commands });
    return;
  }

  const commandsListText = Object.entries(processors)
    .map(([registeredName, command]) => {
      const isAlias = registeredName !== command.name;
      const name = isAlias
        ? `${registeredName} (alias of ${command.name})`
        : command.name;
      return `${name}\n${[
        `${command.description ?? "No description"}`,
        `block mode supported: ${command.supportsBlockMode ? "yes" : "no"}`,
        `line mode supported: ${command.supportsLineMode ? "yes" : "no"}`,
        `attributes schema: ${
          command.attributesSchema !== undefined
            ? JSON.stringify(command.attributesSchema)
            : "N/A"
        }`,
      ]
        .map((s) => `  ${s}`)
        .join("\n")}`;
    })
    .join("\n\n");

  console.log(`available markup commands:\n\n${commandsListText}`);
};
