import {
  Bluehawk,
  SnippetTag,
  ReplaceTag,
  RemoveTag,
  StateTag,
  UncommentTag,
  EmphasizeTag,
  tokens,
} from ".";
import {
  makeBlockTag,
  IdRequiredAttributes,
  IdRequiredAttributesSchema,
} from "./tags";

let bluehawk: Bluehawk | undefined = undefined;

/**
  Returns a standard, shared Bluehawk instance.
 */
export const getBluehawk = async (): Promise<Bluehawk> => {
  if (bluehawk === undefined) {
    const StateUncommentTag = makeBlockTag<IdRequiredAttributes>({
      name: "state-uncomment",
      description: "combines 'uncomment' and 'state'",
      attributesSchema: IdRequiredAttributesSchema,
      process(request) {
        UncommentTag.process(request);
        StateTag.process(request);
      },
    });

    bluehawk = new Bluehawk({
      tags: [
        RemoveTag,
        ReplaceTag,
        SnippetTag,
        StateTag,
        StateUncommentTag,
        UncommentTag,
        EmphasizeTag,
      ],
      // Aliases for backwards compatibility
      tagAliases: [
        ["hide", RemoveTag],
        ["code-block", SnippetTag],
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
        ".dart",
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

    // Add all supported extensions here.
    bluehawk.addLanguage([".py"], {
      languageId: "Python",
      lineComments: [/# ?/],
      stringLiterals: [
        {
          pattern: tokens.PYTHON_STRING_LITERAL_PATTERN,
          multiline: false,
        },
      ],
    });

    bluehawk.addLanguage(["", ".txt", ".rst", ".md", ".json"], {
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
