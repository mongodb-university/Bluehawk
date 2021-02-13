import { ProcessRequest } from "../processor/Processor";
import { Command } from "./Command";

export const RemoveCommand: Command = {
  rules: [], // TODO: Accepts no attributes
  process: ({ commandNode, parseResult }: ProcessRequest): void => {
    const { lineRange } = commandNode;
    parseResult.source.text.remove(
      lineRange.start.offset,
      lineRange.end.offset
    );
  },
};
