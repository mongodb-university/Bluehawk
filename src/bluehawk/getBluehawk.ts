import {
  Bluehawk,
  SnippetCommand,
  ReplaceCommand,
  RemoveCommand,
  StateCommand,
  ProcessRequest,
  UncommentCommand,
} from ".";

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

    // TODO: "hide" is deprecated and "replace-with" will not work as originally
    bluehawk.registerCommand("hide", RemoveCommand);

    // hide and replace-with now belong to "state"
    bluehawk.registerCommand("state", StateCommand);

    // uncomment the block in the state
    bluehawk.registerCommand("state-uncomment", {
      rules: [...StateCommand.rules],
      process: (request: ProcessRequest): void => {
        UncommentCommand.process(request);
        StateCommand.process(request);
      },
    });
  }

  await bluehawk.loadPlugin(pluginPaths);
  return bluehawk;
};
