import { Arguments, CommandModule } from "yargs";
import { getBluehawk } from "../../../bluehawk";
import { MainArgs } from "../../cli";

const handler = async ({ plugin }: Arguments<MainArgs>): Promise<void> => {
  const bluehawk = await getBluehawk(plugin);

  const { processor } = bluehawk;
  const { processors } = processor;
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

const commandModule: CommandModule<MainArgs> = {
  command: "commands",
  handler,
  aliases: [],
  describe: "list available commands",
};

export default commandModule;
