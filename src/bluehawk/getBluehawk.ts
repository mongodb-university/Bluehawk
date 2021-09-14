import {
  Bluehawk,
  SnippetCommand,
  ReplaceCommand,
  RemoveCommand,
  StateCommand,
  UncommentCommand,
  EmphasizeCommand,
  tokens,
} from ".";
import {
  makeBlockCommand,
  IdRequiredAttributes,
  IdRequiredAttributesSchema,
} from "./commands";

let bluehawk: Bluehawk | undefined = undefined;

/**
  Returns a standard, shared Bluehawk instance.
 */
export const getBluehawk = async (): Promise<Bluehawk> => {
  if (bluehawk === undefined) {
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

    // Add all supported extensions here.
    bluehawk.addLanguage(
      [
        ".c",
        ".cpp",
        ".cs",
        ".h",
        ".hpp",
        ".kt",
        ".java",
        ".js",
        ".jsx",
        ".m",
        ".mm",
        ".swift",
        ".ts",
        ".tsx",
        ".gradle",
        ".groovy",
        ".gvy",
        ".gy",
        ".gsh",
      ],
      {
        languageId: "C-like",
        blockComments: [[/\/\*/, /\*\//]],
        lineComments: [/\/\/ ?/],
      }
    );

    bluehawk.addLanguage(["", ".txt", ".rst", ".md"], {
      languageId: "text",
    });

    bluehawk.addLanguage([".yaml", ".sh"], {
      languageId: "bashlike",
      lineComments: [/# ?/],
      // String literal specification required as it's the only way to use # as
      // not-a-comment
      stringLiterals: [
        {
          pattern: tokens.JSON_STRING_LITERAL_PATTERN,
          multiline: false,
        },
      ],
    });

    bluehawk.addLanguage([".xml", ".svg", ".html", ".htm", ".uxml"], {
      languageId: "xml",
      blockComments: [[/<!--/, /-->/]],
    });
  }

  return bluehawk;
};

/**
  Resets the bluehawk instance (for unit testing).
 */
getBluehawk.reset = (): Promise<Bluehawk> => {
  bluehawk = undefined;
  return getBluehawk();
};
