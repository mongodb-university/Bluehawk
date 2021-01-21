import { ProcessRequest } from "../processor/Processor";
import { Command } from "./Command";

export const RemoveCommand: Command = {
  rules: [], // TODO: Accepts no attributes
  process: ({ command, parseResult }: ProcessRequest): void => {
    const { lineRange } = command;
    parseResult.source.text.remove(
      lineRange.start.offset,
      lineRange.end.offset
    );
  },
};
