import { ProcessRequest } from "./Processor";

export const RemoveCommand = ({
  command,
  bluehawkResult,
}: ProcessRequest): void => {
  const { lineRange } = command;
  bluehawkResult.source.text.remove(
    lineRange.start.offset,
    lineRange.end.offset
  );
};
