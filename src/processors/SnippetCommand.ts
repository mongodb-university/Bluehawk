import Processor, {
  ParseCommandResult,
  CommandConfig,
  ParseCommand,
  ProcessCommand,
} from "./Processor";
import { strict as assert } from "assert";
import { CommandNode } from "../parser/CommandNode";

export default class SnippetCommand extends ParseCommand {
  constructor(config: CommandConfig) {
    super(config);
  }
  process(command: CommandNode): ParseCommandResult {
    assert(command.content);
    Processor.publish({
      event: "snippet",
      path: command.source,
      content: command.content,
    });
    return {
      range: {
        start: command.range.start.offset,
        end: command.range.end.offset,
      },
      result: command.content,
    };
  }
}
