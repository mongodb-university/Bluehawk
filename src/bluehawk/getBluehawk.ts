import {
  Bluehawk,
  SnippetCommand,
  ReplaceCommand,
  RemoveCommand,
  StateCommand,
  UncommentCommand,
} from ".";
import {
  makeBlockCommand,
  IdRequiredAttributes,
  IdRequiredAttributesSchema,
} from "./commands";

let bluehawk: Bluehawk | undefined = undefined;

// Returns a standard Bluehawk instance with the given plugins
export const getBluehawk = async (
  pluginPaths?: string | string[]
): Promise<Bluehawk> => {
  if (bluehawk === undefined) {
    const StateUncommentCommand = makeBlockCommand<IdRequiredAttributes>({
      name: "state-uncomment",
      attributesSchema: IdRequiredAttributesSchema,
      process(request) {
        UncommentCommand.process(request);
        StateCommand.process(request);
      },
    });

    bluehawk = new Bluehawk({
      commands: [
        RemoveCommand,
        ReplaceCommand,
        SnippetCommand,
        StateCommand,
        StateUncommentCommand,
        UncommentCommand,
      ],
      // Aliases for backwards compatibility
      commandAliases: [
        ["hide", RemoveCommand],
        ["code-block", SnippetCommand],
      ],
    });
  }

  await bluehawk.loadPlugin(pluginPaths);
  return bluehawk;
};
