import { ProcessRequest } from "./Processor";
import { CommandProcessor } from "./CommandProcessor";

export const RemoveCommand: CommandProcessor = {
  rules: [], // TODO: Accepts no attributes
  process: ({ command, parseResult }: ProcessRequest): void => {
    const { lineRange } = command;
    parseResult.source.text.remove(
      lineRange.start.offset,
      lineRange.end.offset
    );
  },
};
