import { BluehawkError } from "./BluehawkError";

export type OnErrorFunction = (
  filePath: string,
  errors: BluehawkError[]
) => void;

// A standard implementation of OnErrorFunction
export const logErrorsToConsole: OnErrorFunction = (filePath, errors) => {
  console.error(
    `Error in ${filePath}:\n${errors
      .map(
        (error) =>
          `  at line ${error.location.line} col ${error.location.column}: ${error.message}`
      )
      .join("\n")}`
  );
};
