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

// Returns a standard Bluehawk instance with
export const getBluehawk = async (
  pluginPaths?: string | string[]
): Promise<Bluehawk> => {
  if (bluehawk === undefined) {
    bluehawk = new Bluehawk();
    bluehawk.registerCommand("code-block", SnippetCommand);
    bluehawk.registerCommand("replace", ReplaceCommand);
    bluehawk.registerCommand("snippet", SnippetCommand);
    bluehawk.registerCommand("remove", RemoveCommand);
    bluehawk.registerCommand("emphasize", EmphasizeCommand);

    // TODO: "hide" is deprecated and "replace-with" will not work as originally
    bluehawk.registerCommand("hide", RemoveCommand);

    // hide and replace-with now belong to "state"
    bluehawk.registerCommand("state", StateCommand);

    const StateUncommentCommand = makeBlockCommand<IdRequiredAttributes>({
      attributesSchema: IdRequiredAttributesSchema,
      process(request) {
        UncommentCommand.process(request);
        StateCommand.process(request);
      },
    });

    // uncomment the block in the state
    bluehawk.registerCommand("state-uncomment", StateUncommentCommand);
  }

  await bluehawk.loadPlugin(pluginPaths);
  return bluehawk;
};
