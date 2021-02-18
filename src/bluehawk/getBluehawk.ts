import {
  Bluehawk,
  SnippetCommand,
  ReplaceCommand,
  RemoveCommand,
  StateCommand,
  UncommentCommand,
  EmphasizeCommand,
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
    bluehawk = new Bluehawk();

    const StateUncommentCommand = makeBlockCommand<IdRequiredAttributes>({
      name: "state-uncomment",
      description: "combines 'uncomment' and 'state'",
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
        EmphasizeCommand,
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
