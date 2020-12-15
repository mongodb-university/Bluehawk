import { ParseCommandResult, CommandConfig, ParseCommand } from "./Processor";
import { strict as assert } from "assert";
import { CommandNode } from "../parser/CommandNode";

export default class RemoveCommand extends ParseCommand {
  constructor(cfg: CommandConfig) {
    super(cfg);
  }

  process(command: CommandNode): ParseCommandResult {
    assert(command.content);
    return {
      range: {
        start: command.range.start.offset,
        end: command.range.end.offset,
      },
      result: "",
    };
  }
}
